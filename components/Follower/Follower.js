import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

//components
//services
import FollowerUserList from "./FollowerUserList";
import db from "../../config/firebase";

function Follower({ username, userId, following, loggedInUserDocId }) {
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    const followingUsers = following?.length > 0 ? following : ["test"];

    db.collection("users")
      .where("userId", "in", [...followingUsers])
      .onSnapshot((snapshot) => {
        setProfiles(
          snapshot?.docs.map((doc) => ({
            id: doc?.id,
            ...doc?.data(),
          }))
        );
      });
  }, [userId]);

  return !profiles ? (
    <Skeleton count={1} height={150} className="mt-5" />
  ) : profiles.length > 0 ? (
    <div className="rounded flex flex-col">
      <div className="text-sm flex items-center align-items justify-between mb-2">
        <p className="font-bold text-gray-base">{username} Following List </p>
      </div>
      <div className="mt-4 grid gap-5">
        {profiles.map((profile) => (
          <FollowerUserList
            key={profile.id}
            profileDocId={profile.id}
            username={profile.username}
            profileId={profile.userId}
            image={profile.photoURL}
            userId={userId}
            loggedInUserDocId={loggedInUserDocId}
          />
        ))}
      </div>
    </div>
  ) : null;
}

export default Follower;
{
  /** */
}
