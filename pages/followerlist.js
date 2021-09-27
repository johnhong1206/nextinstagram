import React from "react";
import User from "../components/User";
import Suggestion from "../components/Suggestion";
import Skeleton from "react-loading-skeleton";
import db, { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import Header from "../components/Header";
import Follower from "../components/Follower";

function Followerlist() {
  const [user] = useAuthState(auth);
  const [userData, loading] = useDocument(
    user && db.collection("users").doc(user?.uid)
  );
  if (loading) return <Skeleton count={1} height={61} />;

  return (
    <div>
      <Header />
      <div className="grid px-8">
        <div>
          <User
            username={userData?.data().username}
            fullName={userData?.data().fullName}
            image={userData?.data().photoURL}
            uid={userData?.data().userId}
          />
          <Suggestion
            userId={userData?.data().userId}
            following={userData?.data().following}
            loggedInUserDocId={userData?.id}
          />
          <div className="mt-10 border-gray-300 border-t-2 py-4">
            <Follower
              username={userData?.data().username}
              userId={userData?.data().userId}
              following={userData?.data().follower}
              loggedInUserDocId={userData?.id}
              following={userData?.data().following}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Followerlist;
