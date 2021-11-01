import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";

import {
  selectPhotos,
  addPhoto,
  addProfile,
  selectProfile,
  selectUser,
} from "../../features/userSlice";
import db, { auth } from "../../config/firebase";

const DynamicHeader = dynamic(() => import("../../components/Header/Header"));

const DynamicUserBio = dynamic(() =>
  import("../../components/Profile/UserBio")
);

const DynamicNouserBio = dynamic(() =>
  import("../../components/Profile/NouserBio")
);

const DynamicUserPhoto = dynamic(() =>
  import("../../components/Profile/UserPhoto")
);
const MenuModal = dynamic(() => import("../../components/Modal/MenuModal"));
const PostImageModal = dynamic(() =>
  import("../../components/Modal/PostImageModal")
);

import { AiOutlineInstagram } from "react-icons/ai";
import { IoBookmarkOutline } from "react-icons/io5";

import { useAuthState } from "react-firebase-hooks/auth";
import {
  selectMenuModalIsOpen,
  selectPostImageModalIsOpen,
} from "../../features/modalSlice";

function Profile({ usersList, bio, photos, savephotos }) {
  const dispatch = useDispatch();
  const user = useAuthState(auth);
  const userProfile = useSelector(selectProfile);
  const photoCollecction = useSelector(selectPhotos);
  const currentUser = useSelector(selectUser);
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [photo, setPhoto] = useState([]);
  const [phase, setPhase] = useState("Photo");
  const menuModal = useSelector(selectMenuModalIsOpen);
  const postImageModal = useSelector(selectPostImageModalIsOpen);

  useEffect(() => {
    if (router.query.id) {
      async function getPhotos() {
        const unsubscribe = db
          .collection("photos")
          .where("userId", "==", router.query.id)
          .onSnapshot((snapshot) =>
            setPhoto(snapshot.docs.map((doc) => doc.data()))
          );
        return unsubscribe;
      }
      getPhotos();
    }
  }, [router.query.id]);

  async function getUserData() {
    const unsubscribe = db
      .collection("users")
      .doc(router.query.id)
      .onSnapshot((snapshot) => setUserData(snapshot.data()));
    return unsubscribe;
  }

  useEffect(() => {
    if (router.query.id) {
      getUserData();
    }
  }, [router.query.id]);

  useEffect(() => {
    function addVisitProfile() {
      dispatch(
        addProfile({
          profileDocId: userData?.userId,
          profileUsername: userData?.username,
          image: userData?.photoURL,
          profileUserId: userData?.userId,
          fullName: userData?.fullName,
          photosCount: photoCollecction?.length,
          followers: userData?.followers,
          followersCount: userData?.followers?.length,
          following: userData?.following,
          followingCount: userData?.following?.length,
          bios: userData?.bios,
          email: userData?.email,
          savePhoto: userData?.savePhoto,
        })
      );
    }
    return addVisitProfile();
  });

  const showBio = () => {
    if (currentUser) {
      return JSON.parse(bio).map((userData) => (
        <DynamicUserBio
          key={userData?.userId}
          profileDocId={userData?.userId}
          profileUsername={userData?.username}
          image={userData?.photoURL}
          profileUserId={userData?.userId}
          fullName={userData?.fullName}
          photosCount={photoCollecction?.length}
          followers={userData?.followers}
          followersCount={userData?.followers?.length}
          following={userData?.following}
          followingCount={userData?.following?.length}
          bios={userData?.bios}
          email={userData?.email}
          savePhoto={userData?.savePhoto}
        />
      ));
    } else {
      return JSON.parse(bio).map((userData) => (
        <DynamicNouserBio
          key={userData?.userId}
          profileDocId={userData?.userId}
          profileUsername={userData?.username}
          image={userData?.photoURL}
          profileUserId={userData?.userId}
          fullName={userData?.fullName}
          photosCount={photoCollecction?.length}
          followers={userData?.followers}
          followersCount={userData?.followers?.length}
          following={userData?.following}
          followingCount={userData?.following?.length}
          bios={userData?.bios}
          email={userData?.email}
          savePhoto={userData?.savePhoto}
        />
      ));
    }
  };

  const ShowPhoto = () => {
    return JSON.parse(photos).map((photo) => (
      <DynamicUserPhoto key={photo.id} photo={photo} />
    ));
  };

  const showSavePhoto = () => {
    return JSON.parse(savephotos).map((photo) => (
      <DynamicUserPhoto key={photo.id} photo={photo} />
    ));
  };

  useEffect(() => {
    dispatch(addPhoto(photo));
  });

  const togglePhase = () => {
    if (phase === "Photo") {
      setPhase("Saved");
    }
    if (phase === "Saved") {
      setPhase("Photo");
    }
  };
  return (
    <div className="w-full">
      <Head>
        <title>{userData.username} Profile</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DynamicHeader usersList={JSON.parse(usersList)} />
      {bio ? (
        <main>
          {showBio()}

          <div className="flex flex-row items-center justify-center w-full my-4 space-x-4">
            <Phase
              name={"Photo"}
              isActive={phase == "Photo" ? true : false}
              togglePhase={togglePhase}
            />
            <Phase
              name={"Saved"}
              isActive={phase == "Saved" ? true : false}
              togglePhase={togglePhase}
            />
          </div>
          {phase == "Photo" && (
            <div className="px-5 my-10 gap-8 sm:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex flex-wrap items-center justify-center">
              {ShowPhoto()}
            </div>
          )}
          {phase == "Saved" && (
            <div className="px-5 my-10 gap-8 sm:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex flex-wrap items-center justify-center">
              {showSavePhoto()}
            </div>
          )}
        </main>
      ) : null}
      {menuModal && <MenuModal />}
      {postImageModal && <PostImageModal />}
    </div>
  );
}

export default Profile;

export async function getServerSideProps(context) {
  const uesrRef = db.collection("users");
  const usersRes = await uesrRef.get();
  const users = usersRes.docs.map((user) => ({
    id: user.id,
    ...user.data(),
  }));

  const ref = await db
    .collection("users")
    .where("userId", "==", context.query.id)
    .get();

  const photoRef = await db
    .collection("photos")
    .where("userId", "==", context.query.id)
    .get();

  const bio = ref.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  const photos = photoRef.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const savedPhotoRef = await db
    .collection("photos")
    .where("save", "array-contains", context.query.id)
    .get();

  const savephotos = savedPhotoRef.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  return {
    props: {
      bio: JSON.stringify(bio),
      photos: JSON.stringify(photos),
      savephotos: JSON.stringify(savephotos),
      usersList: JSON.stringify(users),
    },
  };
}

const Phase = ({ name, isActive, togglePhase, Icon }) => {
  return (
    <div className={`flex flex-col items-center `}>
      <div className={`flex flex-row items-center justify-center space-x-1 `}>
        <h1
          className={`font-bold ${
            isActive ? "text-gray-500" : "text-gray-300"
          }`}
        >
          {name}
        </h1>
        {name == "Photo" && (
          <AiOutlineInstagram
            className={`font-bold ${
              isActive ? "text-gray-500" : "text-gray-300"
            }`}
          />
        )}
        {name == "Saved" && (
          <IoBookmarkOutline
            className={`font-bold ${
              isActive ? "text-gray-500" : "text-gray-300"
            }`}
          />
        )}
      </div>

      <div
        onClick={togglePhase}
        className={`w-4 h-4 rounded-full cursor-pointer ${
          isActive ? "bg-blue-600" : "bg-gray-400"
        }`}
      />
    </div>
  );
};
