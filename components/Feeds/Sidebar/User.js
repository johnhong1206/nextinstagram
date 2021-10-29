import React from "react";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import { useRouter } from "next/router";
import { logout } from "../../../features/userSlice";
import { auth } from "../../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";

function User({ username, fullName, image, uid }) {
  const [user] = useAuthState(auth);

  const router = useRouter();
  const dispatch = useDispatch();

  const togglelogout = () => {
    if (user) {
      auth.signOut().then(() => {
        dispatch(logout());
      });
    }
  };

  const navProfile = () => {
    router.push(`/profile/${uid}`);
  };

  return !username || !fullName ? (
    <Skeleton count={1} height={61} />
  ) : (
    <div className="flex items-center justify-between mt-14 ml-10">
      <img
        onClick={navProfile}
        className="w-16 h-16 border p-[2px] rounded-full cursor-pointer"
        src={image}
        alt={`${username} ProfileImg`}
      />
      <div className="flex-1 mx-4">
        <h2 className="font-bold uppercase ">{username}</h2>
        {fullName && <p className="text-sm text-gray-400">{fullName}</p>}
      </div>
      <button
        onClick={togglelogout}
        className="text-xs font-bold text-blue-400"
      >
        Sign Out
      </button>
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
