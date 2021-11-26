import { useState, useContext, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import db, { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import firebase from "firebase";

function PostAction({
  docId,
  totalLikes,
  likedPhoto,
  save,
  handleFocus,
  content,
  savedPhoto,
}) {
  const [user] = useAuthState(auth);
  const userId = user?.uid;
  const [toggleLiked, setToggleLiked] = useState(false);
  const [likes, setLikes] = useState(totalLikes);
  const [toggleSaved, setToggleSaved] = useState(savedPhoto);
  const [photoLikeSave, setPhotoLikeSave] = useState();

  useEffect(() => {
    db.collection("photos")
      .doc(docId)
      .onSnapshot((snapshot) => setPhotoLikeSave(snapshot.data()));
  }, [db, user]);

  const likesss = photoLikeSave?.likes?.includes(user?.uid);
  const savesssss = photoLikeSave?.save?.includes(user?.uid);

  const handleToggleLiked = async () => {
    await db
      .collection("photos")
      .doc(docId)
      .update({
        likes: likesss
          ? firebase.firestore.FieldValue.arrayRemove(userId)
          : firebase.firestore.FieldValue.arrayUnion(userId),
      });
    setLikes((likes) => (likesss ? likes - 1 : likes + 1));
  };

  const handleToggleSave = async () => {
    await db
      .collection("photos")
      .doc(docId)
      .update({
        save: savesssss
          ? firebase.firestore.FieldValue.arrayRemove(userId)
          : firebase.firestore.FieldValue.arrayUnion(userId),
      });

    await db
      .collection("users")
      .doc(userId)
      .update({
        savePhoto: savesssss
          ? firebase.firestore.FieldValue.arrayRemove(docId)
          : firebase.firestore.FieldValue.arrayUnion(docId),
      });
  };

  return (
    <>
      <div className=" flex justify-between p-4">
        {user && (
          <div className="flex item-center justify-center space-x-4">
            {!likesss && (
              <AiOutlineHeart
                onClick={handleToggleLiked}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleLiked();
                  }
                }}
                className={`w-8 h-8 select-none cursor-pointer focus:outline-none ${
                  likesss ? "text-red-400" : "text-black-light"
                }`}
              />
            )}
            {likesss && (
              <AiFillHeart
                onClick={handleToggleLiked}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleLiked();
                  }
                }}
                className={`w-8 h-8 select-none cursor-pointer focus:outline-none ${
                  likesss ? "text-red-400" : "text-black-light"
                }`}
              />
            )}

            <BsChatDots
              className="w-8 h-8 text-black-light select-none cursor-pointer focus:outline-none"
              onClick={handleFocus}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleFocus();
                }
              }}
            />
            {savesssss && (
              <IoBookmark
                onClick={handleToggleSave}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleSave();
                  }
                }}
                className={`w-8 h-8 select-none cursor-pointer focus:outline-none ${
                  savesssss ? "text-blue-400" : "text-black-light"
                }`}
              />
            )}
            {!savesssss && (
              <IoBookmarkOutline
                onClick={handleToggleSave}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleSave();
                  }
                }}
                className={`w-8 h-8 select-none cursor-pointer focus:outline-none ${
                  savesssss ? "text-blue-400" : "text-black-light"
                }`}
              />
            )}
          </div>
        )}
      </div>
      <div className="p-4 py-0">
        <p className="font-bold">
          {likes === 1 ? `${likes} like` : `${likes} likes`}
        </p>
      </div>
    </>
  );
}

export default PostAction;
