import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  client,
  recommendProfiles,
  getPublications,
  searchProfiles,
} from "../api";
import { css } from "@emotion/css";

import { Button, SearchInput, Placeholders } from "../components";

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const response = await client.query(recommendProfiles).toPromise();
      const profileData = await Promise.all(
        response.data.recommendedProfiles.map(async (profile) => {
          const pub = await client
            .query(getPublications, { id: profile.id, limit: 1 })
            .toPromise();
          profile.publication = pub.data.publications.items[0];
          return profile;
        })
      );
      setProfiles(profileData);
    } catch (err) {
      console.log("error fetching recommended profiles: ", err);
    }
  }

  async function searchForProfile() {
    try {
      const response = await client
        .query(searchProfiles, {
          query: searchString,
          type: "PROFILE",
        })
        .toPromise();
      const profileData = await Promise.all(
        response.data.search.items.map(async (profile) => {
          const pub = await client
            .query(getPublications, { id: profile.profileId, limit: 1 })
            .toPromise();
          profile.id = profile.profileId;
          profile.publication = pub.data.publications.items[0];
          return profile;
        })
      );

      setProfiles(profileData);
    } catch (err) {
      console.log("error searching profiles...", err);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      searchForProfile();
    }
  }

  console.log({ profiles });

  return (
    <div>
      <div className={searchContainerStyle}>
        <SearchInput
          placeholder="Search"
          onChange={(e) => setSearchString(e.target.value)}
          value={searchString}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={searchForProfile} buttonText="SEARCH PROFILES" />
      </div>{" "}
      <div>
        {profiles.map((profile, index) => (
          <Link href={`/profile/${profile.id}`} key={index}>
            <a>
              {profile.picture ? (
                <img
                  src={profile.picture?.original?.url || profile.picture.uri}
                  alt={profile.handle}
                  style={{ height: "60px", width: "60px" }}
                />
              ) : (
                <div style={blankPhotoStyle} />
              )}
              <p>{profile.handle}</p>
              <p>{profile.publication?.metadata.content}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

const searchContainerStyle = css`
  padding: 40px 0px 30px;
`;

const blankPhotoStyle = {
  width: "52px",
  height: "52px",
  backgroundColor: "black",
};
