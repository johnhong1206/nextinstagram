import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import db from "../../config/firebase";

const AddComment = dynamic(() => import("./AddComment"));

import Link from "next/link";
import useAuth from "../../hooks/useAuth";

function PostComments({ docId, commentInput }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentsSlice, setCommentsSlice] = useState(2);
  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 2);
  };

  useEffect(() => {
    db.collection("photos")
      .doc(docId)
      .collection("comments")
      .onSnapshot((snapshot) => {
        setComments(
          snapshot?.docs.map((doc) => ({
            id: doc?.id,
            ...doc?.data(),
          }))
        );
      });
  }, [db, docId]);

  return (
    <>
      <div className="p-4 pt-1 pb-4">
        {comments?.slice(0, commentsSlice).map((item) => (
          <p key={`${item.comment}-${item.displayName}`} className="mb-1">
            <Link href={`/p/${item.displayName}`}>
              <span className="mr-1 font-bold">{item.displayName}</span>
            </Link>
            <span>{item.comment}</span>
          </p>
        ))}
        {comments?.length >= 2 && commentsSlice < comments?.length && (
          <button
            className="text-sm text-gray-base mb-1 cursor-pointer focus:outline-none"
            type="button"
            onClick={showNextComments}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                showNextComments();
              }
            }}
          >
            View more comments
          </button>
        )}
      </div>
      {user && (
        <AddComment
          docId={docId}
          comments={comments}
          setComments={setComments}
          commentInput={commentInput}
        />
      )}
    </>
  );
}

export default PostComments;
