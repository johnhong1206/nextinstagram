import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import Header from "../../components/Header/Header";
import ExplorePost from "../../components/Explore/ExplorePost";
import db from "../../config/firebase";
import { Circle } from "better-react-spinkit";
import { useSelector } from "react-redux";
import { selectMenuModalIsOpen } from "../../features/modalSlice";
import MenuModal from "../../components/Modal/MenuModal";

function Index() {
  const photoRef = db.collection("photos");
  const [photoSnapshot, loading] = useCollection(photoRef);
  const menuModal = useSelector(selectMenuModalIsOpen);

  return (
    <div>
      <Header />
      <main className="max-w-screen mx-auto">
        {!loading ? (
          <div className="px-5 my-10 grid grid-flow-row-dense gap-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <div className="grid grid-flow-row-dense grid-cols-1 gap-1 md:grid-cols-2">
              {photoSnapshot?.docs.slice(0, 4).map((content) => (
                <ExplorePost
                  key={content?.id}
                  id={content?.id}
                  content={content.data()}
                  loading={loading}
                />
              ))}
            </div>
            {photoSnapshot?.docs.slice(4, 5).map((content) => (
              <ExplorePost
                key={content?.id}
                id={content?.id}
                content={content.data()}
                loading={loading}
              />
            ))}
            <div className="grid grid-flow-row-dense grid-cols-1 gap-1 md:grid-cols-4 col-span-2">
              {photoSnapshot?.docs.slice(5, 9).map((content) => (
                <ExplorePost
                  key={content?.id}
                  id={content?.id}
                  content={content.data()}
                  loading={loading}
                />
              ))}
            </div>
            <div className="grid grid-flow-row-dense grid-cols-1 gap-1 md:grid-cols-4 col-span-2">
              {photoSnapshot?.docs.slice(9, 12).map((content) => (
                <ExplorePost
                  key={content?.id}
                  id={content?.id}
                  content={content.data()}
                  loading={loading}
                />
              ))}
            </div>
            {photoSnapshot?.docs.slice(12, 13).map((content) => (
              <ExplorePost
                key={content?.id}
                id={content?.id}
                content={content.data()}
                loading={loading}
              />
            ))}
            <div className="grid grid-flow-row-dense grid-cols-1 gap-1 md:grid-cols-2">
              {photoSnapshot?.docs
                .slice(13, photoSnapshot.length - 1)
                .map((content) => (
                  <ExplorePost
                    key={content?.id}
                    id={content?.id}
                    content={content.data()}
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
