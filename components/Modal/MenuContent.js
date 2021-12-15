import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import {
  IoLogInOutline,
  IoCompassOutline,
  IoLogOutOutline,
  IoHomeOutline,
  IoChatboxOutline,
  IoSearchOutline,
  IoPersonCircleOutline,
  IoPeopleSharp,
} from "react-icons/io5";
import { logout } from "../../features/userSlice";
import { useDispatch } from "react-redux";
import { closemenuModal } from "../../features/modalSlice";
import useAuth from "../../hooks/useAuth";

function MenuContent() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useAuth();

  const navtoHome = (e) => {
    router.push("/");
    dispatch(closemenuModal());
  };

  const navtoLogin = (e) => {
    router.push("/login");
    dispatch(closemenuModal());
  };

  const navtoFollowerList = () => {
    router.push("/followerlist");
    dispatch(closemenuModal());
  };

  const navtoChat = () => {
    router.push("/chat/");
    dispatch(closemenuModal());
  };

  const NavtoUserProfile = (e) => {
    router.push(`/profile/${user?.uid}`);
    dispatch(closemenuModal());
  };

  const NavtoExplore = (e) => {
    router.push("/explore");
    dispatch(closemenuModal());
  };

  const handleAuthentication = () => {
    if (user) {
      auth.signOut().then(() => {
        router.replace("/");
        router.reload();
      });
      dispatch(logout());
      dispatch(closemenuModal());
    }
  };

  return (
    <div className={`w-full h-full p-8 md:p-16 text-center`}>
      <div className="h-full space-y-8">
        <div
          onClick={navtoHome}
          className={`flex items-center space-x-4 border-b-4 border-transparent hover:text-blue-500 hover:border-blue-500 cursor-pointer `}
        >
          <IoHomeOutline className="w-12 h-12" />
          <p className="text-xl font-medium">Home</p>
        </div>
        <div
          onClick={NavtoUserProfile}
          className={`flex items-center space-x-4 border-b-4 border-transparent hover:text-blue-500 hover:border-blue-500 cursor-pointer `}
        >
          <IoPersonCircleOutline className="w-12 h-12" />
          <p className="text-xl font-medium">Profile</p>
        </div>
        <div
          onClick={navtoFollowerList}
          className={`flex items-center space-x-4 border-b-4 border-transparent hover:text-blue-500 hover:border-blue-500 cursor-pointer `}
        >
          <IoPeopleSharp className="w-12 h-12" />
          <p className="text-xl font-medium">Followers</p>
        </div>
        <div
          onClick={NavtoExplore}
          className={`flex items-center space-x-4 border-b-4 border-transparent hover:text-blue-500 hover:border-blue-500 cursor-pointer `}
        >
          <IoCompassOutline className="w-12 h-12" />
          <p className="text-xl font-medium">Explore</p>
        </div>
        <div
          onClick={navtoChat}
          className={`flex items-center space-x-4 border-b-4 border-transparent hover:text-blue-500 hover:border-blue-500 cursor-pointer `}
        >
          <IoChatboxOutline className="w-12 h-12" />
          <p className="text-xl font-medium">Message</p>
        </div>
        {user ? (
          <div
            onClick={handleAuthentication}
            className={`flex items-center space-x-4 border-b-4 border-transparent hover:text-red-500 hover:border-red-500 cursor-pointer `}
          >
            <IoLogOutOutline className="w-12 h-12" />
            <p className="text-xl font-medium">Logout</p>
          </div>
        ) : (
          <div
            onClick={navtoLogin}
            className={`flex items-center space-x-4 border-b-4 border-transparent hover:text-green-500 hover:border-green-500 cursor-pointer `}
          >
            <IoLogInOutline className="w-12 h-12" />
            <p className="text-xl font-medium">Login</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuContent;
