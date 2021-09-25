import { useEffect } from "react";
import Head from "next/head";

import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import Header from "../../components/Header";
import PersonChatllist from "../../components/PersonChatllist";
import db from "../../config/firebase";

function Index() {
  const user = useSelector(selectUser);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user?.profileDocId);
  const [chatSnapshot] = useCollection(userChatRef);

  return (
    <div className="">
      <Head>
        <title>ZH Instagram || Chat</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main className="max-w-screen mx-auto">
        <div className="flex p-10">
          <div className="flex flex-col flex-grow w-2/3">
            {chatSnapshot?.docs.map((chat) => (
              <PersonChatllist
                key={chat.id}
                id={chat.id}
                users={chat.data().users}
                displayName={chat.data().displayName}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Index;
