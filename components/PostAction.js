import { useState, useContext } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import db, { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import firebase from "firebase";

function PostAction({
  docId,
  totalLikes,
  likedPhoto,
  save,
  handleFocus,
  content,
}) {
  const [user] = useAuthState(auth);
  const userId = user?.uid;
  const [toggleLiked, setToggleLiked] = useState(likedPhoto);
  const [likes, setLikes] = useState(totalLikes);
  const [toggleSaved, setToggleSaved] = useState(save);

  const handleToggleLiked = async () => {
    setToggleLiked((toggleLiked) => !toggleLiked);
    await db
      .collection("photos")
      .doc(docId)
      .update({
        likes: toggleLiked
          ? firebase.firestore.FieldValue.arrayRemove(userId)
          : firebase.firestore.FieldValue.arrayUnion(userId),
      });
    setLikes((likes) => (toggleLiked ? likes - 1 : likes + 1));
  };

  const handleToggleSave = async () => {
    setToggleSaved((toggleSaved) => !toggleSaved);
    await db
      .collection("photos")
      .doc(docId)
      .update({
        save: toggleSaved
          ? firebase.firestore.FieldValue.arrayRemove(userId)
          : firebase.firestore.FieldValue.arrayUnion(userId),
      });

    await db
      .collection("users")
      .doc(userId)
      .update({
        savePhoto: toggleSaved
          ? firebase.firestore.FieldValue.arrayRemove(content)
          : firebase.firestore.FieldValue.arrayUnion(content),
      });
  };

  return (
    <>
      <div className=" flex justify-between p-4">
        {user && (
          <div className="flex item-center justify-center space-x-4">
            {!toggleLiked && (
              <AiOutlineHeart
                onClick={handleToggleLiked}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleLiked();
                  }
                }}
                className={`w-8 h-8 select-none cursor-pointer focus:outline-none ${
                  toggleLiked ? "text-red-400" : "text-black-light"
                }`}
              />
            )}
            {toggleLiked && (
              <AiFillHeart
                onClick={handleToggleLiked}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleLiked();
                  }
                }}
                className={`w-8 h-8 select-none cursor-pointer focus:outline-none ${
                  toggleLiked ? "text-red-400" : "text-black-light"
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
            {toggleSaved && (
              <IoBookmark
                onClick={handleToggleSave}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleSave();
                  }
                }}
                className={`w-8 h-8 select-none cursor-pointer focus:outline-none ${
                  toggleSaved ? "text-blue-400" : "text-black-light"
                }`}
              />
            )}
            {!toggleSaved && (
              <IoBookmarkOutline
                onClick={handleToggleSave}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleSave();
                  }
                }}
                className={`w-8 h-8 select-none cursor-pointer focus:outline-none ${
                  toggleSaved ? "text-blue-400" : "text-black-light"
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
