import { useRouter } from "next/router";

import ChatHeader from "../../components/Chat/ChatHeader";
import db, { auth } from "../../config/firebase";
import firebase from "firebase";

import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

import Message from "../../components/Chat/Message";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";

function ChatScreen({ chat, messages }) {
  const user = useSelector(selectUser);
  const router = useRouter();
  const endofMessageRef = useRef(null);
  const scrollToBottom = () => {
    endofMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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
      return null;
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user?.email,
      displayName: user?.profileUsername,
      photoURL: user?.image,
      userId: user?.profileDocId,
    });

    setInput("");
    scrollToBottom();
  };
  return (
    <div className="">
      <ChatHeader chat={chat} />
      <div className=" pt-0 -mt-10 lg:pt-4 flex-grow min-h-screen h-full space-y-16 lg:p-4 bg-gray-800 overflow-y-scroll scrollbar-hide">
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
