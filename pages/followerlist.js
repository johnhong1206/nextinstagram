import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import db from "../config/firebase";

const Header = dynamic(() => import("../components/Header/Header"));
const User = dynamic(() => import("../components/Feeds/Sidebar/User"));
const Suggestion = dynamic(() =>
  import("../components/Feeds/Sidebar/Suggestion")
);
const Follower = dynamic(() => import("../components/Follower/Follower"));
const MenuModal = dynamic(() => import("../components/Modal/MenuModal"));

import { selectMenuModalIsOpen } from "../features/modalSlice";
import { useSelector } from "react-redux";
import useAuth from "../hooks/useAuth";

function Followerlist() {
  const menuModal = useSelector(selectMenuModalIsOpen);
  const { user } = useAuth();

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    let unsubscribe;
    const fetchUserData = () => {
      if (user) {
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
      }
    };
    fetchUserData();
    return unsubscribe;
  }, [db, user]);

  return (
    <div>
      <Head>
        <title>ZH Instagram || Follower List</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header userData={userData} />
      <div className="grid px-8">
        <div>
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
          <div className="mt-10 border-gray-300 border-t-2 py-4">
            <Follower
              username={userData?.username}
              userId={userData?.userId}
              follower={userData?.follower}
              loggedInUserDocId={userData?.id}
              following={userData?.following}
            />
          </div>
        </div>
      </div>
      {menuModal && <MenuModal />}
    </div>
  );
}

export default Followerlist;
