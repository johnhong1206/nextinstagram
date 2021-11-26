import React from "react";
import dynamic from "next/dynamic";

import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import Skeleton from "react-loading-skeleton";
import db, { auth } from "../../config/firebase";
const Timeline = dynamic(() => import("./Timeline/Timeline"));
const Suggestion = dynamic(() => import("./Sidebar/Suggestion"));
const User = dynamic(() => import("./Sidebar/User"));
const Stories = dynamic(() => import("../Story/Stories"));

function Feeds({ noUserphotos, stories, photo }) {
  const [user] = useAuthState(auth);
  const [userData, loading] = useDocument(
    user && db.collection("users").doc(user?.uid)
  );

  if (loading) return <Skeleton count={1} height={61} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto">
      <section className="col-span-2">
        {user && <Stories stories={stories} />}
        <Timeline photo={photo} />
      </section>
      <section className="hidden xl:inline-grid md:col-span-1">
        <div className="fixed top-20">
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
      </section>
    </div>
  );
}

export default Feeds;
