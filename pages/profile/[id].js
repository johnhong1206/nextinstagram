import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";
import db, { auth } from "../../config/firebase";
import { selectMenuModalIsOpen } from "../../features/modalSlice";
import { AiOutlineInstagram } from "react-icons/ai";
import { IoBookmarkOutline } from "react-icons/io5";
import useAuth from "../../hooks/useAuth";

const DynamicHeader = dynamic(() => import("../../components/Header/Header"));
const DynamicUserBio = dynamic(() =>
  import("../../components/Profile/UserBio")
);
const DynamicUserPhoto = dynamic(() =>
  import("../../components/Profile/UserPhoto")
);
const MenuModal = dynamic(() => import("../../components/Modal/MenuModal"));

function Profile({ usersList }) {
  const { user } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [userDatas, setUserDatas] = useState([]);

  const [photo, setPhoto] = useState([]);
  const [savephoto, setSavePhoto] = useState([]);
  const [phase, setPhase] = useState("Photo");
  const menuModal = useSelector(selectMenuModalIsOpen);

  useEffect(() => {
    if (user) {
      let unsubscribe;
      const fetchUSerData = () => {
        unsubscribe = db
          .collection("users")
          .doc(user?.uid)
          .get()
          .then((documentSnapshot) => {
            if (!documentSnapshot.exists) {
            } else {
              //console.log('User data: ', documentSnapshot.data());
              setUserData(documentSnapshot.data());
            }
          });
      };
      fetchUSerData();
      return unsubscribe;
    }
  }, [db, user]);

  useEffect(() => {
    let unsubscribe;
    const fetchUserData = () => {
      unsubscribe = db
        .collection("users")
        .doc(router.query.id)
        .onSnapshot((snapshot) => setUserData(snapshot.data()));
    };
    fetchUserData();
    return unsubscribe;
  }, [db, router.query.id]);

  useEffect(() => {
    let unsubscribe;
    const getPhotos = () => {
      unsubscribe = db
        .collection("photos")
        .where("userId", "==", router.query.id)
        .onSnapshot((snapshot) =>
          setPhoto(snapshot.docs.map((doc) => doc.data()))
        );
    };
    getPhotos();
    return unsubscribe;
  }, [db, router.query.id]);

  useEffect(() => {
    let unsubscribe;

    const fetchPhotos = () => {
      if (user) {
        unsubscribe = db
          .collection("photos")
          .where("save", "array-contains", router.query.id)
          .onSnapshot((snapshot) => {
            setSavePhoto(
              snapshot?.docs.map((doc) => ({
                id: doc?.id,
                ...doc?.data(),
              }))
            );
          });
      } else {
        setSavePhoto([]);
      }
    };
    fetchPhotos();
    return unsubscribe;
  }, [db, router.query.id]);

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
      <DynamicHeader usersList={JSON.parse(usersList)} userData={userDatas} />
      <DynamicUserBio
        key={userData?.userId}
        profileDocId={userData?.userId}
        profileUsername={userData?.username}
        image={userData?.photoURL}
        profileUserId={userData?.userId}
        fullName={userData?.fullName}
        photosCount={photo?.length}
        followers={userData?.followers}
        followersCount={userData?.followers?.length}
        following={userData?.following}
        followingCount={userData?.following?.length}
        bios={userData?.bios}
        email={userData?.email}
        savePhoto={userData?.savePhoto}
      />

      <main>
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
            {photo.map((photo) => (
              <DynamicUserPhoto key={photo.id} photo={photo} />
            ))}
          </div>
        )}
        {phase == "Saved" && (
          <div className="px-5 my-10 gap-8 sm:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex flex-wrap items-center justify-center">
            {savephoto.map((photo) => (
              <DynamicUserPhoto key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </main>

      {menuModal && <MenuModal />}
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

  return {
    props: {
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
