import React, { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Skeleton from "react-loading-skeleton";
import db, { auth, storage } from "../config/firebase";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import {
  AiOutlineInstagram,
  AiOutlineEdit,
  AiOutlineMessage,
} from "react-icons/ai";
import { useRouter } from "next/router";
import { isUserFollowingProfile, toggleFollow } from "../service/firebase";
import { useSelector, useDispatch } from "react-redux";
import { selectProfile, selectUser } from "../features/userSlice";

import { MdModeEdit, MdUpdate } from "react-icons/md";
import { BsFillImageFill } from "react-icons/bs";

function UserBio({
  photosCount,
  profileDocId,
  profileUsername,
  image,
  profileUserId,
  fullName,
  followers,
  following,
  bios,
  profileEmail,
}) {
  const dispatch = useDispatch();
  const imgPickerRef = useRef(null);

  const router = useRouter();
  const user = useSelector(selectUser);
  const profile = useSelector(selectProfile);
  const userRef = db.collection("users").doc(user?.uid);
  const [userData] = useDocument(user && userRef);
  const username = user?.profileUsername;
  const userId = user?.profileDocId;
  const userdocId = userId;

  const [isFollowingProfile, setIsFollowingProfile] = useState(null);
  const activeBtnFollow = username && username !== profileUsername;
  const [followerCount, setFollowerCount] = useState(followers?.length);
  const [editProfile, setEditProfile] = useState(false);
  const [input, setInput] = useState("");
  const [profilemage, setProfileImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", profileDocId);
  const [chatSnapshot] = useCollection(userChatRef);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleToggleFollow = async () => {
    setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
    const activeUserDocId = userdocId;
    const followingUserId = userdocId;

    await toggleFollow(
      isFollowingProfile,
      activeUserDocId,
      profileDocId,
      profileUserId,
      followingUserId
    );
  };

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(username, profileUserId);
      setIsFollowingProfile(!!isFollowing);
    };

    if (username && profileUserId) {
      isLoggedInUserFollowingProfile();
    }
  }, [username, profileUserId]);

  const togleEdit = () => {
    if (profileUsername !== username) {
      setEditProfile(false);
      alert("Your Are not the Auth user");
      router.push("/");
    } else {
      setEditProfile(true);
    }

    if (editProfile === true) {
      setEditProfile(false);
    }
  };

  const UpdateUserBios = (e) => {
    e.preventDefault();

    if (!input) {
      setEditProfile(false);
      return false;
    }
    db.collection("users")
      .doc(profileDocId)
      .set(
        {
          bios: input,
        },
        { merge: true }
      )
      .then(() => {
        setInput("");
        setEditProfile(false);
      })
      .then(() => {
        router.reload();
      });
  };

  const handleUploadProfileimage = () => {
    if (user) {
      const uploadTask = storage
        .ref(`profilemage/${profilemage.name}`)
        .put(profilemage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //progress function...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // Error Function ...
          console.log(error);
          alert(error.message);
        },
        () => {
          //complete function
          storage
            .ref("profilemage")
            .child(profilemage.name)
            .getDownloadURL()
            .then((url) => {
              const Updateuser = auth.currentUser;
              db.collection("users").doc(profileDocId).set(
                {
                  photoURL: url,
                },
                { merge: true }
              );
              Updateuser.updateProfile({
                photoURL: url,
              });
            })
            .then(() => {
              setProgress(0);
              setProfileImage(null);
              setEditProfile(false);
            })
            .then(() => {
              router.reload();
            })
            .catch((error) => alert(error.message));
        }
      );
    } else {
      alert("You are not Authorise user");
    }
  };
  const ChatAlreadyExists = (recipientUid) =>
    !!chatSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientUid)?.length > 0
    );

  const creteChat = () => {
    if (!user) alert("please Login");
    if (!profileDocId) return null;

    if (!ChatAlreadyExists(profileDocId) && profileDocId !== userId) {
      db.collection("chats")
        .add({
          users: [userId, profileDocId],
          displayName: [username, profileUsername],
        })
        .then(() => {
          alert("chat room created");
          router.push("/chat");
        });
    } else {
      alert("chat room exists");
      router.push("/chat");
    }
  };
  if (!profileUsername) null;

  return (
    <div className="p-4 w-full max-w-screen flex items-center justify-center shadow-lg">
      <div className="w-1/3 flex flex-grow items-center justify-center">
        {!editProfile ? (
          <>
            {profileUsername ? (
              <img
                className="rounded-full h-40 w-40 lg:h-80 lg:w-80 flex"
                alt={`${fullName} profile picture`}
                src={image}
              />
            ) : (
              <Skeleton circle height={150} width={150} count={1} />
            )}
          </>
        ) : (
          <div className=" shadow-2xl p-0 lg:p-9 w-full h-56 rounded-full flex flex-col items-center justify-center">
            <div className="">
              <h3 className="font-medium">Update Profile Pic</h3>
            </div>
            <div className="">
              <center>
                <progress value={progress} max="100" />
              </center>
              <div className="flex flex-col lg:flex-row items-center justify-center  w-full space-x-4">
                <div
                  className="inputIcon"
                  onClick={() => imgPickerRef.current.click()}
                >
                  <BsFillImageFill className="h-8 w-8  text-green-500" />

                  <input
                    ref={imgPickerRef}
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleChange}
                  />
                </div>
                <div
                  className={`inputIcon ${profilemage ? "bg-blue-300" : ""}`}
                >
                  {profilemage && (
                    <button
                      onClick={handleUploadProfileimage}
                      className="px-1 py-2 rounded-lg"
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="ml-3 w-3/5 lg:w-full">
        <div className="flex flex-col">
          <div
            className={`flex space-x-3 ${
              username === profileUsername ? "items-baseline" : "items-center"
            }`}
            d
          >
            <p className="text-2xl mr-4 uppercase">{profileUsername}</p>
            {activeBtnFollow && (
              <button
                className={`font-bold text-sm rounded text-black w-20 h-8 ${
                  isFollowingProfile ? "bg-blue-400" : "bg-pink-400"
                }`}
                type="button"
                onClick={handleToggleFollow}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleFollow();
                  }
                }}
              >
                {isFollowingProfile ? "Unfollow" : "Follow"}
              </button>
            )}
            {profileUsername === username && (
              <div className="flex items-center space-x-4 mt-4">
                <AiOutlineInstagram
                  onClick={() => router.push("/imageupload")}
                  className="w-7 h-7 lg:w-8 lg:h-8 hover:text-red-400  rounded-full cursor-pointer"
                />

                <AiOutlineEdit
                  onClick={togleEdit}
                  className="w-7 h-7 lg:w-8 lg:h-8 hover:text-blue-400 cursor-pointer"
                />
              </div>
            )}
            {user && userId !== profileDocId && (
              <AiOutlineMessage
                onClick={creteChat}
                className="h-8 w-8 text-yellow-400 cursor-pointer hover:opacity-60 rounded-full"
              />
            )}
          </div>
        </div>
        <div className="flex item-center mt-4 space-x-2 lg:space-x-4">
          {!followers || !following ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              {!editProfile && (
                <>
                  <div className="flex flex-row space-x-1 items-center">
                    <p className="text-sm lg:text-base">
                      {profile?.photosCount}
                    </p>
                    <p className="text-sm lg:text-base font-bold">photos</p>
                  </div>
                  <div className="flex flex-row space-x-1 items-center">
                    <p className="text-sm lg:text-base">
                      {profile?.followersCount}
                    </p>
                    <p className="text-sm lg:text-base font-bold">
                      {profile?.followersCount === 1 ? `follower` : `followers`}
                    </p>
                  </div>
                  <div className="flex flex-row space-x-1 items-center">
                    <p className="text-sm lg:text-base">
                      {profile?.followingCount}
                    </p>
                    <p className="text-sm lg:text-base font-bold">following</p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="container mt-4 hidden lg:inline-flex">
          <p className="font-medium">
            {!fullName ? <Skeleton count={1} height={24} /> : fullName}
          </p>
        </div>
        <div className=" p-2 w-full h-auto">
          {!editProfile ? (
            <p className="text-base -ml-2">{bios}</p>
          ) : (
            <form
              onSubmit={UpdateUserBios}
              className="flex items-center justify-center space-x-2"
            >
              <input
                className="p-2 h-12 w-full placeholder-gray-700  outline-none bg-white  -ml-2 shadow-lg"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Update Bios ${bios}`}
              />
              <MdUpdate
                className="h-12 w-12 text-purple-400 cursor-pointer "
                type="submit"
                onClick={UpdateUserBios}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserBio;
