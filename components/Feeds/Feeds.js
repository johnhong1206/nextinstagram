import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import db from "../../config/firebase";
import useAuth from "../../hooks/useAuth";
const Timeline = dynamic(() => import("./Timeline/Timeline"));
const Suggestion = dynamic(() => import("./Sidebar/Suggestion"));
const User = dynamic(() => import("./Sidebar/User"));
const Stories = dynamic(() => import("../Story/Stories"));

function Feeds({ noUserphotos, stories, photo }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    db.collection("users")
      .doc(user?.uid)
      .get()
      .then((documentSnapshot) => {
        if (!documentSnapshot.exists) {
        } else {
          //console.log('User data: ', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  }, [db, user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto">
      <section className="col-span-2">
        {user && <Stories stories={stories} />}

        <Timeline photo={photo} />
      </section>
      <section className="hidden xl:inline-grid md:col-span-1">
        <div className="fixed top-20">
          <User
            username={userData?.username}
            fullName={userData?.fullName}
            image={userData?.photoURL}
            uid={userData?.userId}
          />
          <Suggestion
            userId={userData?.userId}
            following={userData?.following}
            loggedInUserDocId={userData?.id}
          />
        </div>
      </section>
    </div>
  );
}

export default Feeds;
