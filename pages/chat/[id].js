import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";

const ChatHeader = dynamic(() => import("../../components/Chat/ChatHeader"));
const Message = dynamic(() => import("../../components/Chat/Message"));

import db from "../../config/firebase";
import firebase from "firebase";

import { useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

import useAuth from "../../hooks/useAuth";

function ChatScreen({ chat, messages }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState([]);

  const router = useRouter();
  const endofMessageRef = useRef(null);
  const scrollToBottom = () => {
    endofMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (user) {
      let unsubscribe;
      const fetchUSerData = () => {
        unsubscribe = db
          .collection("users")
          .doc(user?.uid)
          .get()
          .then((documentSnapshot) => {
            if (!documentSnapshot.exists) {
            } else {
              //console.log('User data: ', documentSnapshot.data());
              setUserData(documentSnapshot.data());
            }
          });
      };
      fetchUSerData();
      return unsubscribe;
    }
  }, [db, user]);

  const [input, setInput] = useState("");
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const showMessage = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          username={message.data().displayName}
          photoURL={message.data().photoURL}
          email={message.data().user}
          userId={message.data().userId}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return <p>Loading</p>;
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: userData?.email,
      displayName: userData?.username,
      photoURL: userData?.photoURL,
      userId: userData?.userId,
    });

    setInput("");
    scrollToBottom();
  };
  return (
    <div className=" w-screen h-screen overflow-hidden">
      <Head>
        <title>ZH Instagram || Chat</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ChatHeader chat={chat} />
      <div className=" pt-0 -mt-10 lg:pt-4 flex-grow min-h-screen h-full space-y-16 lg:p-4 bg-gray-800 overflow-y-scroll scrollbar-hide">
        <div className="" />

        {showMessage()}
        <div className="pb-64" ref={endofMessageRef} />
      </div>

      <form className="absolute w-full bottom-0 flex items-center justify-center">
        <input
          className="mb-10 sm:bottom-10 p-4 w-full max-w-6xl shadow-2xl bg-[#fafafa] outline-none ring-gray-900  focus:ring-white"
          placeholder="Type a message"
          type="text"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          disabled={!input?.length === 0 || !user}
        />
        <button hidden type="submit" onClick={sendMessage}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default ChatScreen;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

  // prepare the messages on the server side
  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  // prepare chats
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  console.log(chat, messages);

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}
