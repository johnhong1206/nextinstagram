import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const PostHeader = dynamic(() => import("./PostHeader"));
const PostAction = dynamic(() => import("./PostAction"));
const PostFooter = dynamic(() => import("./PostFooter"));
const PostComments = dynamic(() => import("./PostComments"));

function Posts({ content }) {
  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus();

  return (
    <div className="rounded col-span-4 border bg-white border-gray-primary mb-12 shadow-2xl">
      <PostHeader
        username={content?.username}
        userDocId={content?.userId}
        timestamp={content?.timestamp?.toDate().getTime()}
      />
      <Image
        layout="responsive"
        src={content?.image}
        alt={content?.caption}
        height={480}
        width={720}
        quality="50"
        className="object-contain"
      />
      <PostAction
        docId={content?.id}
        totalLikes={content?.likes?.length}
        likedPhoto={content?.likes}
        save={content?.save}
        savedPhoto={content?.userSavedPhoto}
        handleFocus={handleFocus}
        content={content}
      />
      <PostFooter caption={content?.caption} username={content?.username} />
      <PostComments
        docId={content?.docId}
        comments={content?.comments}
        posted={content?.dateCreated}
        commentInput={commentInput}
      />
    </div>
  );
}

export default Posts;

{
  /** 
     
     */
}
