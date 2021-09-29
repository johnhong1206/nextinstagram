import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import db, { auth } from "../config/firebase";
import getRecipientUid from "../service/getRecipientUid";
import { useDispatch, useSelector } from "react-redux";
import { addChatlist, selectChatlist } from "../features/userSlice";

function PersonChatllist({ id, users, displayName }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [recipientSnapShot] = useCollection(
    db.collection("users").where("userId", "==", getRecipientUid(users, user))
  );

  const peopleinChatlist = useSelector(selectChatlist);

  const recipient = recipientSnapShot?.docs?.[0]?.data();

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  const navProfile = () => {
    router.push(`/profile/${recipient?.userId}`);
  };

  const recipientUid = getRecipientUid(users, user);

  return (
    <div className="container p-4 lg:p-0 col-span-3 lg:col-span-2">
      <div
        key={id}
        onClick={enterChat}
        className="flex items-center cursor-pointer p-4 space-x-4 shadow-lg hover:shadow-inner transform translate duration-150  group"
      >
        {recipient ? (
          <Image
            className="rounded-full cursor-pointer group-hover:animate-pulse"
            src={recipient?.photoURL}
            width="80"
            height="80"
          />
        ) : (
          <div className="h-20 w-20 bg-gray-400 rounded-full" />
        )}
        <div>
          <p className=" uppercase font-medium text-base md:text-xl">
            {recipient?.username}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PersonChatllist;
