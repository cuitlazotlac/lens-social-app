import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import {
  createClient,
  fetchProfile,
  doesFollow as doesFollowQuery,
  createUnfollowTypedData,
  LENS_HUB_CONTRACT_ADDRESS,
} from "../api";
import { ethers } from "ethers";
import { css } from "@emotion/css";
import { AppContext } from "../context";
import { getSigner } from "../utils";
import ReactMarkdown from "react-markdown";

import LENSHUB from "../abi/lenshub";

import { BRAND_COLOR } from "../theme";

export function ProfileMenu({ buttonText, onClick }) {
  const [profile, setProfile] = useState();
  const [publications, setPublications] = useState([]);
  const [doesFollow, setDoesFollow] = useState();
  const [loadedState, setLoadedState] = useState("");
  const router = useRouter();
  const context = useContext(AppContext);
  const { id } = router.query;
  const { userAddress, profile: userProfile } = context;

  useEffect(() => {
    if (id) {
      getProfile();
    }
    if (id && userAddress) {
      checkDoesFollow();
    }
  }, [id, userAddress]);

  async function unfollow() {
    try {
      const client = await createClient();
      const response = await client
        .mutation(createUnfollowTypedData, {
          request: { profile: id },
        })
        .toPromise();
      const typedData = response.data.createUnfollowTypedData.typedData;
      const contract = new ethers.Contract(
        typedData.domain.verifyingContract,
        LENSHUB,
        getSigner()
      );
      const tx = await contract.burn(typedData.value.tokenId);
      setTimeout(() => {
        setDoesFollow(false);
      }, 2500);
      await tx.wait();
      console.log(`successfully unfollowed ... ${profile.handle}`);
    } catch (err) {
      console.log("error:", err);
    }
  }

  async function getProfile() {
    try {
      const { profile: profileData, publications: publicationData } =
        await fetchProfile(id);
      setProfile(profileData);
      setPublications(publicationData);
      setLoadedState("loaded");
    } catch (err) {
      console.log("error fetching profile...", err);
    }
  }

  async function checkDoesFollow() {
    const urqlClient = await createClient();
    const response = await urqlClient
      .query(doesFollowQuery, {
        request: {
          followInfos: [
            {
              followerAddress: userAddress,
              profileId: id,
            },
          ],
        },
      })
      .toPromise();
    setDoesFollow(response.data.doesFollow[0].follows);
  }

  async function followUser() {
    const contract = new ethers.Contract(
      LENS_HUB_CONTRACT_ADDRESS,
      LENSHUB,
      getSigner()
    );

    try {
      const tx = await contract.follow([id], [0x0]);
      setTimeout(() => {
        setDoesFollow(true);
      }, 2500);
      await tx.wait();
      console.log(`successfully followed ... ${profile.handle}`);
    } catch (err) {
      console.log("error: ", err);
    }
  }

  function editProfile() {
    router.push("/edit-profile");
  }

  if (!profile) return null;

  const profileOwner = userProfile?.id === id;
  console.log(profile);
  return (
    <div>
      <button className={profileMenuStyle} onClick={onClick}>
        <span>Publications : {profile.stats.totalPublications}</span>
      </button>
      <button className={profileMenuStyle} onClick={onClick}>
        <span>Posts : {profile.stats.totalPosts}</span>
      </button>
      <button className={profileMenuStyle} onClick={onClick}>
        <span>Publications : {profile.stats.totalPublications}</span>
      </button>
    </div>
  );
}

const profileMenuStyle = css`
  flex: 1 1 auto;
  overflow-x: auto;
  border: none;
  outline: none;
  color: white;
  margin-left: 15px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background-color: rgb(${BRAND_COLOR});
  transition: all 0.35s;
  width: 240px;
  letter-spacing: 0.75px;
  &:hover {
    background-color: rgba(${BRAND_COLOR}, 0.75);
  }
`;
