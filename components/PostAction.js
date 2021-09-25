import { useState, useContext } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import db, { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import firebase from "firebase";

function PostAction({ docId, totalLikes, likedPhoto, handleFocus }) {
  const [user] = useAuthState(auth);
  const userId = user?.uid;
  const [toggleLiked, setToggleLiked] = useState(likedPhoto);
  const [likes, setLikes] = useState(totalLikes);

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

  return (
    <>
      <div className=" flex justify-between p-4">
        {user && (
          <div className="flex">
            {!toggleLiked && (
              <AiOutlineHeart
                onClick={handleToggleLiked}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleLiked();
                  }
                }}
                className={`w-8 h-8 mr-4 select-none cursor-pointer focus:outline-none ${
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
                className={`w-8 h-8 mr-4 select-none cursor-pointer focus:outline-none ${
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
