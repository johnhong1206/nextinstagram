import React from "react";
import dynamic from "next/dynamic";
const NoUserPostHeader = dynamic(() => import("./NoUserPostHeader"));
const PostFooter = dynamic(() => import("./PostFooter"));

function NoUserPosts({ content }) {
  // console.log(content?.username);
  return (
    <div className="rounded col-span-4 border bg-white border-gray-primary mb-12 shadow-2xl">
      <NoUserPostHeader
        username={content.username}
        userDocId={content.userId}
      />
      <img
        src={content.image}
        alt={content.caption}
        className="h-1/2"
        quality="75"
      />
      <PostFooter caption={content.caption} username={content.username} />
    </div>
  );
}

export default NoUserPosts;
