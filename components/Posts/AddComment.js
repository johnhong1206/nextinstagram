import { useState } from "react";
import db from "../../config/firebase";
import firebase from "firebase";
import useAuth from "../../hooks/useAuth";

function AddComment({ docId, comments, setComments, commentInput }) {
  const [comment, setComment] = useState("");
  const { user } = useAuth();
  const displayName = user?.displayName;

  const handleSubmitComment = (event) => {
    event.preventDefault();
    setComments([...comments, { displayName, comment }]);
    setComment("");

    return db
      .collection("photos")
      .doc(docId)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion({
          displayName,
          comment,
        }),
      });
  };

  return (
    <div className="border-t border-gray-200">
      <form
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={(event) =>
          comment.length >= 1
            ? handleSubmitComment(event)
            : event.preventDefault()
        }
      >
        <input
          aria-label="Add a comment"
          autoComplete="off"
          className="text-sm text-gray-base w-full mr-3 py-5 px-4"
          type="text"
          name="add-comment"
          placeholder="Add a comment..."
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          ref={commentInput}
        />
        <button
          className={`text-sm font-bold text-blue-400 ${
            !comment && "opacity-25"
          }`}
          type="button"
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default AddComment;
