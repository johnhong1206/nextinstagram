import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function FollowerUserList({ profileDocId, username, image }) {
  return (
    <div className="flex flex-row items-center align-items justify-between">
      <Link href={`/profile/${profileDocId}`}>
        <div className="flex items-center justify-between cursor-pointer">
          <Image
            className="rounded-full cursor-pointer"
            src={image}
            width="40"
            height="40"
            layout="fixed"
            alt="user photo"
            objectFit="cover"
          />

          <p className="ml-4 font-bold text-sm cursor-pointer">{username}</p>
        </div>
      </Link>
    </div>
  );
}

export default FollowerUserList;
