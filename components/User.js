import React from "react";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import { useRouter } from "next/router";

function User({ username, fullName, image, uid }) {
  const router = useRouter();

  const navProfile = () => {
    router.push(`/profile/${uid}`);
  };

  return !username || !fullName ? (
    <Skeleton count={1} height={61} />
  ) : (
    <div className="flex items-center mb-5">
      <Image
        onClick={navProfile}
        className="rounded-full cursor-pointer"
        src={image}
        width="80"
        height="80"
        layout="fixed"
        alt="user photo"
        objectFit="cover"
        onError={(e) => {
          e.target.src = DEFAULT_IMAGE_PATH;
        }}
      />
      <div className="">
        <p className="ml-4 font-bold text-sm cursor-pointer">{username}</p>
        {fullName && (
          <p className="text-base text-gray-4 00 ml-4 cursor-pointer">
            {fullName}
          </p>
        )}
      </div>
    </div>
  );
}

export default User;

{
  /**<div className="grid grid-cols-4 gap-4 mb-6 items-center">
  <div className="flex items-center justify-between col-span-1">
    <div className="flex items-center justify-between cursor-pointer">
      <div className="">
        <p className="ml-4 font-bold text-sm cursor-pointer">{username}</p>
        {fullName && (
          <p className="text-sm ml-4 font-bold cursor-pointer">{fullName}</p>
        )}
      </div>
    </div>
  </div>
</div>; */
}
