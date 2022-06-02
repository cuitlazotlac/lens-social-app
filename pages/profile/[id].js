import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { client, getProfiles, getPublications } from "../../api";

import { ethers } from "ethers";

import Image from "next/image";

import ABI from "../../abi.json";
const address = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export default function Profile() {
  const [profile, setProfile] = useState();
  const [publications, setPublications] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);
  async function fetchProfile() {
    try {
      const response = await client.query(getProfiles, { id }).toPromise();
      console.log("response: ", response);
      setProfile(response.data.profiles.items[0]);

      const publicationData = await client
        .query(getPublications, { id })
        .toPromise();
      setPublications(publicationData.data.publications.items);
    } catch (err) {}
  }

  async function connect() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log({ accounts });
  }

  async function followUser() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(address, abi, signer);

    try {
      const tx = contract.follow([id], [0x0]);
      await tx.wait();
      console.log("followed user successfully...");
    } catch (err) {
      console.log(err);
    }
  }

  if (!profile) return null;

  return (
    <div>
      <button onClick={connect}>Connect</button>
      {profile.picture ? (
        <Image
          width="200px"
          height="200px"
          src={profile.picture.original.url}
          alt=""
        />
      ) : (
        <div
          style={{ width: "200px", height: "200px", backgroundColor: "black" }}
        />
      )}
      <div>
        <h4>{profile.handle}</h4>
        <p>{profile.bio}</p>
        <p>Followers: {profile.stats.totalFollowers}</p>
        <p>Following: {profile.stats.totalFollowing}</p>
      </div>
      <div>
        {publications.map((publication, index) => (
          <div style={{ padding: "20px" }}>{publication.metadata.content}</div>
        ))}
      </div>
    </div>
  );
}
