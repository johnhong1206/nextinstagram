import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
//components
import SuggestedProfile from "../Feeds/Sidebar/SuggestedProfile";
//services
import { getSuggestedProfiles, getfollower } from "../../service/firebase";
import FollowerUserList from "./FollowerUserList";

function Follower({ username, userId, following, loggedInUserDocId }) {
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    async function suggestedProfiles() {
      const response = await getfollower(userId, following);
      setProfiles(response);
    }

    if (userId) {
      suggestedProfiles();
    }
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
            key={profile.docId}
            profileDocId={profile.docId}
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
