import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectPhotos,
  addPhoto,
  addProfile,
  selectProfile,
} from "../../features/userSlice";
import Head from "next/head";
import db from "../../config/firebase";
import Header from "../../components/Header";
import UserBio from "../../components/UserBio";
import UserPhoto from "../../components/UserPhoto";
import { AiOutlineInstagram } from "react-icons/ai";
import { IoBookmarkOutline } from "react-icons/io5";

function Profile({ bio, photos }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [photo, setPhoto] = useState([]);
  const [phase, setPhase] = useState("Photo");

  const photoCollecction = useSelector(selectPhotos);
  const userProfile = useSelector(selectProfile);

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

  useEffect(() => {
    if (router.query.id) {
      async function getUserData() {
        const unsubscribe = db
          .collection("users")
          .doc(router.query.id)
          .onSnapshot((snapshot) => setUserData(snapshot.data()));

        return unsubscribe;
      }
      getUserData();
    }
  }, [router.query.id]);

  useEffect(() => {
    async function addVisitProfile() {
      await dispatch(
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
    addVisitProfile();
  });

  const showBio = () => {
    return JSON.parse(bio).map((userData) => (
      <UserBio
        key={userData?.id}
        profileDocId={userData?.userId}
        profileUsername={userData?.username}
        image={userData?.photoURL}
        profileUserId={userData?.userId}
        fullName={userData?.fullName}
        photosCount={photoCollecction?.length}
        followers={userData?.followers}
        following={userData?.following}
        bios={userData?.bios}
        profileEmail={userData?.email}
      />
    ));
  };

  const ShowPhoto = () => {
    return JSON.parse(photos).map((photo) => (
      <UserPhoto key={photo.id} photo={photo} />
    ));
  };

  const showSavePhoto = () => {
    userProfile?.savePhoto?.map((photo) => (
      <div key={photo.photoId}>
        <h1>{photo.username}</h1>
      </div>
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
      <Header />
      {bio ? (
        <main>
          {userProfile ? showBio() : null}
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
              {userProfile?.savePhoto?.map((photo) => (
                <UserPhoto key={photo.id} photo={photo} />
              ))}
            </div>
          )}
        </main>
      ) : null}
    </div>
  );
}

export default Profile;

export async function getServerSideProps(context) {
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

  return {
    props: {
      bio: JSON.stringify(bio),
      photos: JSON.stringify(photos),
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
