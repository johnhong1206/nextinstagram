import React, { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("../../components/Header/Header"));
const ExplorePost = dynamic(() =>
  import("../../components/Explore/ExplorePost")
);
const MenuModal = dynamic(() => import("../../components/Modal/MenuModal"));

import db from "../../config/firebase";
import { Circle } from "better-react-spinkit";
import { useSelector } from "react-redux";
import { selectMenuModalIsOpen } from "../../features/modalSlice";

function Index() {
  const [photoSnapshot, setPhotoSnapshot] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuModal = useSelector(selectMenuModalIsOpen);

  useEffect(() => {
    let unsubscribe;
    const fetchPhotos = () => {
      unsubscribe = db.collection("photos").onSnapshot((snapshot) => {
        setPhotoSnapshot(
          snapshot?.docs.slice(0, 2).map((doc) => ({
            id: doc?.id,
            ...doc?.data(),
          }))
        );
      });
    };
    fetchPhotos();
    return unsubscribe;
  }, [db]);

  useEffect(() => {
    if (photoSnapshot) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, photoSnapshot);

  return (
    <div>
      <Head>
        <title>ZH Instagram || Explore</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="max-w-screen mx-auto">
        {!loading ? (
          <div className="px-5 my-10 grid grid-flow-row-dense gap-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <div className="grid grid-flow-row-dense grid-cols-1 gap-1 md:grid-cols-2">
              {photoSnapshot?.slice(0, 4).map((content) => (
                <ExplorePost
                  key={content?.id}
                  id={content?.id}
                  content={content}
                  loading={loading}
                />
              ))}
            </div>
            {photoSnapshot?.slice(4, 5).map((content) => (
              <ExplorePost
                key={content?.id}
                id={content?.id}
                content={content}
                loading={loading}
              />
            ))}
            <div className="grid grid-flow-row-dense grid-cols-1 gap-1 md:grid-cols-4 col-span-2">
              {photoSnapshot?.slice(5, 9).map((content) => (
                <ExplorePost
                  key={content?.id}
                  id={content?.id}
                  content={content}
                  loading={loading}
                />
              ))}
            </div>
            <div className="grid grid-flow-row-dense grid-cols-1 gap-1 md:grid-cols-4 col-span-2">
              {photoSnapshot?.slice(9, 12).map((content) => (
                <ExplorePost
                  key={content?.id}
                  id={content?.id}
                  content={content}
                  loading={loading}
                />
              ))}
            </div>
            {photoSnapshot?.slice(12, 13).map((content) => (
              <ExplorePost
                key={content?.id}
                id={content?.id}
                content={content}
                loading={loading}
              />
            ))}
            <div className="grid grid-flow-row-dense grid-cols-1 gap-1 md:grid-cols-2">
              {photoSnapshot
                ?.slice(13, photoSnapshot.length - 1)
                .map((content) => (
                  <ExplorePost
                    key={content?.id}
                    id={content?.id}
                    content={content}
                    loading={loading}
                  />
                ))}
            </div>
          </div>
        ) : (
          <>
            <div className="w-screen h-96 flex items-center justify-center">
              <Circle color="#4c68d7" size={120} />
            </div>
          </>
        )}
      </main>
      {menuModal && <MenuModal />}
    </div>
  );
}

export default Index;
