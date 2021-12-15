import React, { useState } from "react";
import Image from "next/image";

import Link from "next/link";
import {
  updateLoggedInUserFollowing,
  updateFollowedUserFollowers,
} from "../../../service/firebase";
import useAuth from "../../../hooks/useAuth";
import { useRouter } from "next/router";

function SuggestedProfile({
  profileDocId,
  username,
  image,
  profileId,
  userId,
}) {
  const [followed, setFollowed] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const togglefollowing = async () => {
    async function handleFollowUser() {
      setFollowed(true);
      await updateLoggedInUserFollowing(userId, profileId, false);
      await updateFollowedUserFollowers(profileDocId, userId, false);
    }
    handleFollowUser().then(() => {
      router.reload();
    });
  };

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
        onClick={togglefollowing}
      >
        Follow
      </button>
    </div>
  ) : null;
}

export default SuggestedProfile;
