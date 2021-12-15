import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import db from "../../config/firebase";
import getRecipientUid from "../../service/getRecipientUid";
import useAuth from "../../hooks/useAuth";

function PersonChatllist({ id, users }) {
  const router = useRouter();
  const { user } = useAuth();
  const [lastMessage, setLastMessage] = useState("");

  const [recipientSnapShot] = useCollection(
    user &&
      db.collection("users").where("userId", "==", getRecipientUid(users, user))
  );

  const recipient = recipientSnapShot?.docs?.[0]?.data();

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setLastMessage(snapshot.docs[0]?.data()?.message)
      );
    return unsubscribe;
  }, [db, id]);

  return (
    <div className="container p-4 lg:p-0 col-span-3 lg:col-span-2 mt-9">
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
          <p className="font-base text-gray-400 text-sm md:text-base">
            {lastMessage || "Say Hi..."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PersonChatllist;
