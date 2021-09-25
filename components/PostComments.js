import { useState } from "react";
import AddComment from "./AddComment";
import Link from "next/link";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function PostComments({ docId, comments: allComments, posted, commentInput }) {
  const [user] = useAuthState(auth);
  const [comments, setComments] = useState(allComments);
  const [commentsSlice, setCommentsSlice] = useState(2);
  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 2);
  };
  return (
    <>
      <div className="p-4 pt-1 pb-4">
        {comments.slice(0, commentsSlice).map((item) => (
          <p key={`${item.comment}-${item.displayName}`} className="mb-1">
            <Link href={`/p/${item.displayName}`}>
              <span className="mr-1 font-bold">{item.displayName}</span>
            </Link>
            <span>{item.comment}</span>
          </p>
        ))}
        {comments.length >= 2 && commentsSlice < comments.length && (
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
