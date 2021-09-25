import React from "react";
import User from "../components/User";
import Suggestion from "../components/Suggestion";
import Skeleton from "react-loading-skeleton";
import db, { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import Header from "../components/Header";

function followerlist() {
  const [user] = useAuthState(auth);
  const [userData, loading] = useDocument(
    user && db.collection("users").doc(user?.uid)
  );
  if (loading) return <Skeleton count={1} height={61} />;
  return (
    <div>
      <Header />
      <div className="grid p-10">
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
        </div>
      </div>
    </div>
  );
}

export default followerlist;
