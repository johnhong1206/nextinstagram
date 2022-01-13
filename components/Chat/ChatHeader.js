import { useRouter } from "next/router";
import Image from "next/image";

import db from "../../config/firebase";
import { useDocument } from "react-firebase-hooks/firestore";
import { useState } from "react";
import { AiOutlineArrowLeft, AiFillHome } from "react-icons/ai";
import { useCollection } from "react-firebase-hooks/firestore";
import getRecipientUid from "../../service/getRecipientUid";
import useAuth from "../../hooks/useAuth";

function ChatHeader({ chat }) {
  const router = useRouter();
  const { user } = useAuth();

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
    <header className="h-16 bg-white border-b border-gray-100 mb-8 shadow-md sticky top-0 z-50">
      <div className=" container mx-auto max-w-screen-lg h-full">
        <div className="flex items-center justify-between h-full px-3">
          <div>
            <AiOutlineArrowLeft
              className="w-8 h-8 cursor-pointer"
              onClick={NavtoChatScreen}
            />
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
            <AiFillHome
              className="w-8 h-8 cursor-pointer"
              onClick={navtoHome}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;
