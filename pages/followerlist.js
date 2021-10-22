import React from "react";

import Skeleton from "react-loading-skeleton";
import db, { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import Header from "../components/Header/Header";
import User from "../components/Feeds/Sidebar/User";
import Suggestion from "../components/Feeds/Sidebar/Suggestion";
import Follower from "../components/Follower/Follower";
import MenuModal from "../components/Modal/MenuModal";
import { selectMenuModalIsOpen } from "../features/modalSlice";
import { useSelector } from "react-redux";

function Followerlist() {
  const menuModal = useSelector(selectMenuModalIsOpen);

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
              follower={userData?.data().follower}
              loggedInUserDocId={userData?.id}
              following={userData?.data().following}
            />
          </div>
        </div>
      </div>
      {menuModal && <MenuModal />}
    </div>
  );
}

export default Followerlist;
