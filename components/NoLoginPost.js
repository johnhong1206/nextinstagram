import { useRef } from "react";
import NoLoginPostHeader from "./NoLoginPostHeader";
import PostAction from "./PostAction";
import PostFooter from "./PostFooter";
import PostComments from "./PostComments";

function NoLoginPost({ content, profileId, username, userId }) {
  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus();

  return (
    <div className="rounded col-span-4 border bg-white border-gray-primary mb-12 shadow-2xl">
      <NoLoginPostHeader
        username={username}
        userDocId={userId}
        timestamp={content.timestamp?.toDate().getTime()}
      />
      <img
        loading="lazy"
        src={content.image}
        alt={content.caption}
        className="h-1/2"
      />
      <PostAction
        docId={content.docId}
        totalLikes={content.likes.length}
        likedPhoto={content.userLikedPhoto}
        handleFocus={handleFocus}
      />
      <PostFooter caption={content.caption} username={content.username} />
      <PostComments
        docId={content.docId}
        comments={content.comments}
        posted={content.dateCreated}
        commentInput={commentInput}
      />
    </div>
  );
}

export default NoLoginPost;
