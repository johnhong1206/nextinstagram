import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import {
  IoLogInOutline,
  IoCompassOutline,
  IoLogOutOutline,
  IoHomeOutline,
  IoChatboxOutline,
  IoSearchOutline,
  IoAddCircleOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import { auth } from "../../config/firebase";
import { useEffect, useState, useRef } from "react";
import { logout, selectUser, selectUserList } from "../../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { openMenuModal } from "../../features/modalSlice";
import useAuth from "../../hooks/useAuth";

function Header({ usersList, userData, goback, navProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const all_Users = useSelector(selectUserList);

  const { user } = useAuth();
  const dataList = all_Users;

  const searchRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const excludeColumns = ["color"];

  //console.log(usersList);

  const handleChange = (value) => {
    setSearchTerm(value);
    //filterData(value); handleSearch
    handleSearch();
  };

  const handleSearch = (e) => {
    let trem = e.target.value;
    trem = searchRef.current.value;
    setSearchTerm(trem);
    const filteredData = dataList?.filter((item) => {
      return Object.keys(item).some((key) =>
        excludeColumns.includes(key)
          ? false
          : item[key].toString().toLowerCase().includes(trem)
      );
    });
    setSearchResults(filteredData);
  };

  const navtoHome = (e) => {
    router.push("/");
  };

  const navtoLogin = (e) => {
    router.push("/login");
  };

  const navPostImg = (e) => {
    router.push("/imageupload");
  };

  const navtoReginter = (e) => {
    router.push("/register");
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
          router.reload();
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
    dispatch(openMenuModal());
  };

  const togglePostImageModal = () => {
    dispatch(openMenuModal());
  };

  return (
    <header className="h-16 sticky top-0 z-40 bg-white border-b border-gray-100 mb-8 shadow-md">
      <div className=" container mx-auto max-w-screen-lg h-full">
        <div className="flex items-center justify-between h-full">
          <div className=" text-gray-700 text-center flex items-center cursor-pointer align-items">
            {!goback ? (
              <h1 onClick={navtoHome} className="flex justify-center w-full">
                <img
                  src="/images/logo.png"
                  alt="logo"
                  className="mt-2 w-6/12 cursor-pointer"
                />
              </h1>
            ) : (
              <div onClick={navProfile} className="px-4">
                <IoArrowBackOutline className="w-6 h-6 text-gray-500" />
              </div>
            )}
          </div>
          <div className=" relative mt-1 p-3 rounded-md flex-shrink lg:flex-grow ">
            <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
              <IoSearchOutline className="w-6 h-6 text-gray-500" />
            </div>
            <input
              ref={searchRef}
              onMouseOver={() => setShowResults(true)}
              onBlur={() => setShowResults(false)}
              onFocus={() => setShowResults(true)}
              onChange={handleSearch}
              type="text"
              placeholder="Search"
              className="bg-gray-50 relative block w-full pl-10  sm-text-sm border-gray-300 focus:ring-black focus:border-black"
            />
            {showResults && (
              <div
                onClick={() => setShowResults(true)}
                onMouseOver={() => setShowResults(true)}
                onMouseLeave={() => setShowResults(false)}
                className="absolute w-full bg-white bottom-0 z-10 rounded-md"
                style={{
                  transform: "translateY(100%)",
                  height: "auto",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {!!searchResults.length ? (
                  searchResults?.map(({ id, photoURL, username, email }) => (
                    <>
                      <Link href={`/profile/${id}`}>
                        <div className="flex items-center cursor-pointer px-1 py-4 hover:shadow-2xl">
                          <Image
                            className="rounded-full cursor-pointer"
                            src={photoURL}
                            width="40"
                            height="40"
                            layout="fixed"
                            alt="user photo"
                            objectFit="cover"
                          />
                          <div>
                            <p className="ml-4 font-bold text-sm cursor-pointer">
                              {username}
                            </p>
                            <p className="ml-4 text-xs cursor-pointer text-gray-500">
                              {email}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </>
                  ))
                ) : (
                  <>
                    {searchTerm && (
                      <p className="text-xs text-gray-400 text-center py-2">
                        No users found
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className=" text-gray-700 text-center flex items-center cursor-pointer align-items pr-4">
            <p className="flex items-center  justify-center w-full space-x-4">
              {user ? (
                <>
                  <IoHomeOutline
                    onClick={navtoHome}
                    className="w-6 h-6 inputIcon"
                  />
                  <IoAddCircleOutline
                    onClick={navPostImg}
                    className="w-6 h-6"
                  />
                  <IoLogOutOutline
                    onClick={togglelogout}
                    className="w-7 h-7 hidden lg:inline-flex inputIcon"
                  />
                  <IoCompassOutline
                    onClick={NavtoExplore}
                    className="w-7 h-7 hidden  lg:inline-flex inputIcon"
                  />
                  <IoChatboxOutline
                    onClick={navtoChat}
                    className="w-6 h-6 hidden lg:inline-flex inputIcon"
                  />
                  <div
                    onClick={toggleSection}
                    className="flex flex-col items-center relative p-4 inputIcon"
                  >
                    <Image
                      className="rounded-full cursor-pointer inputIcon"
                      src={
                        userData?.photoURL ||
                        "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"
                      }
                      width="40"
                      height="40"
                      layout="fixed"
                      quality="50"
                    />
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
