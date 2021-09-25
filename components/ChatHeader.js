import { useRouter } from "next/router";
import Image from "next/image";

import {
  IoLogInOutline,
  IoLogOutOutline,
  IoHomeOutline,
  IoChatboxOutline,
} from "react-icons/io5";
import db, { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { useState } from "react";
import { AiOutlineArrowLeft, AiFillHome } from "react-icons/ai";
import { useCollection } from "react-firebase-hooks/firestore";
import getRecipientUid from "../service/getRecipientUid";

function ChatHeader({ chat }) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const userRef = db.collection("users").doc(user?.uid);
  const [userData] = useDocument(user && userRef);
  const username = userData?.data().username;
  const userId = userData?.data().userId;
  const [toggle, setToggle] = useState(false);

  const navtoHome = (e) => {
    router.push("/");
  };
  const NavtoChatScreen = (e) => {
    router.push(`/chat`);
  };

  const NavProfile = (e) => {
    router.push(`/profile/${recipientUid}`);
  };
  const [recipientSnapShot] = useCollection(
    db
      .collection("users")
      .where("userId", "==", getRecipientUid(chat?.users, user))
  );
  const recipientUid = getRecipientUid(chat?.users, user);
  const recipient = recipientSnapShot?.docs[0]?.data();

  return (
    <header className="h-16 bg-white border-b border-gray-100 mb-8 shadow-md">
      <div className=" container mx-auto max-w-screen-lg h-full">
        <div className="flex items-center justify-between h-full px-3">
          <div>
            <AiOutlineArrowLeft className="w-8 h-8" onClick={NavtoChatScreen} />
          </div>
          <div className=" text-gray-700 text-center flex items-center cursor-pointer align-items">
            {recipient ? (
              <Image
                className="rounded-full cursor-pointer"
                src={recipient?.photoURL}
                width="40"
                height="40"
                layout="fixed"
                onClick={NavProfile}
              />
            ) : (
              <img
                className="rounded-full cursor-pointer"
                src={recipient?.photoURL}
                width="40"
                height="40"
                layout="fixed"
                onClick={NavProfile}
              />
            )}
          </div>
          <div>
            <AiFillHome className="w-8 h-8" onClick={NavtoChatScreen} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;
