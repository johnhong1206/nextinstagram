import { useRouter } from "next/router";
import Image from "next/image";

import {
  IoLogInOutline,
  IoCompassOutline,
  IoLogOutOutline,
  IoHomeOutline,
  IoChatboxOutline,
} from "react-icons/io5";
import db, { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { useState } from "react";
import { logout, selectUser } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";

function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, loading] = useAuthState(auth);
  const userRedux = useSelector(selectUser);
  const userRef = db.collection("users").doc(user?.uid);
  const [userData] = useDocument(user && userRef);
  //const username = userData?.data().username;
  //const userId = userData?.data().userId;
  //const userImage = userData?.data().photoURL;
  const [toggle, setToggle] = useState(false);

  const navtoHome = (e) => {
    router.push("/");
  };

  const navtoLogin = (e) => {
    router.push("/login");
  };

  const navtoReginter = (e) => {
    router.push("/register");
  };

  const navtoFollowerList = () => {
    router.push("/followerlist");
  };

  const togglelogout = () => {
    if (user) {
      router
        .replace("/")
        .then(() => {
          auth.signOut();
        })
        .then(() => {
          dispatch(logout());
        });
    }
  };

  const navtoChat = () => {
    router.push("/chat/");
  };

  const NavtoUserProfile = (e) => {
    router.push(`/profile/${user?.uid}`);
  };

  const NavtoExplore = (e) => {
    router.push("/explore");
  };

  const toggleSection = () => {
    if (!toggle) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  return (
    <header className="h-16 sticky top-0 z-40 bg-white border-b border-gray-100 mb-8 shadow-md">
      <div className=" container mx-auto max-w-screen-lg h-full">
        <div className="flex justify-between h-full">
          <div className=" text-gray-700 text-center flex items-center cursor-pointer align-items">
            <h1 onClick={navtoHome} className="flex justify-center w-full">
              <img
                src="/images/logo.png"
                alt="logo"
                className="mt-2 w-6/12 cursor-pointer"
              />
            </h1>
          </div>
          <div className=" text-gray-700 text-center flex items-center cursor-pointer align-items pr-4">
            <p className="flex items-center  justify-center w-full space-x-4">
              {user ? (
                <>
                  <IoHomeOutline onClick={navtoHome} className="w-6 h-6" />
                  <IoLogOutOutline
                    onClick={togglelogout}
                    className="w-7 h-7 hidden lg:inline-flex"
                  />
                  <IoCompassOutline
                    onClick={NavtoExplore}
                    className="w-7 h-7 hidden  lg:inline-flex"
                  />
                  <IoChatboxOutline
                    onClick={navtoChat}
                    className="w-6 h-6 hidden lg:inline-flex"
                  />
                  <div
                    onClick={toggleSection}
                    className="flex flex-col items-center relative p-4 "
                  >
                    <Image
                      className="rounded-full cursor-pointer"
                      src={
                        userRedux?.image ||
                        "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"
                      }
                      width="40"
                      height="40"
                      layout="fixed"
                      quality="50"
                    />
                    {toggle && (
                      <div
                        className={` z-50 absolute top-14 right-2 lg:-right-8 bg-[#fafafa] text-gray-900  cursor-pointer p-12 lg:p-8 shadow-2xl rounded-2xl opacity-0
                      ${toggle && "opacity-100"}
                      `}
                      >
                        {toggle && (
                          <div className="flex flex-col items-center justify-center space-y-3 px-4 py-2 lg:px-0 lg:py-0 lg:space-y-0 text-lg font-medium">
                            <div className=" flex items-center justify-center hover:animate-pulse filte ">
                              <h3
                                onClick={NavtoUserProfile}
                                className=" hover:underline"
                              >
                                Profile
                              </h3>
                            </div>
                            <div className="lg:hidden flex items-center justify-center hover:animate-pulse filte ">
                              <h3
                                onClick={NavtoExplore}
                                className=" hover:underline"
                              >
                                Explore
                              </h3>
                            </div>
                            <div className="lg:hidden flex items-center justify-center hover:animate-pulse filte ">
                              <h3
                                onClick={navtoFollowerList}
                                className=" hover:underline"
                              >
                                <span>To</span>
                                <span className="ml-1">Follow</span>
                              </h3>
                            </div>
                            <div className="lg:hidden flex items-center justify-center hover:animate-pulse filte ">
                              <h3
                                onClick={navtoChat}
                                className=" hover:underline"
                              >
                                Chat
                              </h3>
                            </div>
                            <div className="lg:hidden flex items-center justify-center hover:animate-pulse filte">
                              {user ? (
                                <h3
                                  onClick={togglelogout}
                                  className=" hover:underline"
                                >
                                  Logout
                                </h3>
                              ) : (
                                <h3
                                  onClick={navtoLogin}
                                  className=" hover:underline"
                                >
                                  Login
                                </h3>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={navtoLogin}
                    type="button"
                    className=" bg-[#458eff] font-medium text-sm rounded text-white w-20 h-8 hover:shadow-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={navtoReginter}
                    type="button"
                    className=" text-[#458eff] font-medium text-sm rounded  w-20 h-8 hover:shadow-lg"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
