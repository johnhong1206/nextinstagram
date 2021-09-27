import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";

import Link from "next/link";
import {
  updateLoggedInUserFollowing,
  updateFollowedUserFollowers,
  toggleFollow,
  isUserFollowingProfile,
} from "../service/firebase";
import { selectUser } from "../features/userSlice";

function FollowerUserList({
  profileDocId,
  username,
  image,
  profileId,
  loggedInUserDocId,
}) {
  const [followed, setFollowed] = useState(false);
  const user = useSelector(selectUser);
  const userId = user?.profileDocId;
  const userdocId = userId;

  const profileUserId = profileDocId;
  const [isFollowingProfile, setIsFollowingProfile] = useState(null);

  const handleToggleFollow = async () => {
    setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
    const activeUserDocId = userdocId;
    const followingUserId = userdocId;

    await toggleFollow(
      isFollowingProfile,
      activeUserDocId,
      profileDocId,
      profileUserId,
      followingUserId
    );
  };

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(username, profileUserId);
      setIsFollowingProfile(!!isFollowing);
    };

    if (username && profileUserId) {
      isLoggedInUserFollowingProfile();
    }
  }, [username, profileUserId]);

  async function handleFollowUser() {
    setFollowed(true);
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
    await updateFollowedUserFollowers(profileDocId, userId, false);
  }

  if (userId === profileId) return false;

  return !followed ? (
    <div className="flex flex-row items-center align-items justify-between">
      <Link href={`/profile/${profileDocId}`}>
        <div className="flex items-center justify-between cursor-pointer">
          <Image
            className="rounded-full cursor-pointer"
            src={image}
            width="40"
            height="40"
            layout="fixed"
            alt="user photo"
            objectFit="cover"
          />

          <p className="ml-4 font-bold text-sm cursor-pointer">{username}</p>
        </div>
      </Link>
      <button
        className="text-xs font-bold text-blue-400"
        type="button"
        onClick={handleToggleFollow}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleToggleFollow();
          }
        }}
      >
        UnFollow
      </button>
    </div>
  ) : null;
}

export default FollowerUserList;
