import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { AiOutlinePlusCircle } from "react-icons/ai";
import db, { auth } from "../../config/firebase";
import { useRouter } from "next/router";

//components
import Story from "./Story";

//services

import { getUniqueValues } from "../../utils/helper";

//redux
import { useDispatch } from "react-redux";
import { openviewStoriesModal } from "../../features/modalSlice";
import { updateViewedStory } from "../../features/storiesSlice";

function Stories() {
  const router = useRouter();

  const dispatch = useDispatch();
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState([]);
  const [stories, setStories] = useState([]);
  const [myStories, setMystories] = useState([]);
  const following = userData?.following;

  const storiesUser = stories ? getUniqueValues(stories, "userId") : null;
  const myStoriesUser = myStories ? getUniqueValues(myStories, "userId") : null;

  useEffect(() => {
    db.collection("users")
      .doc(user?.uid)
      .get()
      .then((documentSnapshot) => {
        if (!documentSnapshot.exists) {
        } else {
          //console.log('User data: ', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  }, [db, user]);

  useEffect(() => {
    let unsubscribe;

    const fetchPhotos = () => {
      if (user) {
        const followingUsers = following?.length > 0 ? following : ["test"];
        const allphoto = [];

        unsubscribe = db
          .collection("stories")
          .where("userId", "in", [...followingUsers])
          .onSnapshot((snapshot) => {
            setStories(
              snapshot?.docs.map((doc) => ({
                id: doc?.id,
                ...doc?.data(),
              }))
            );
          });
      }
    };
    fetchPhotos();
    return unsubscribe;
  }, [db, following, user]);

  useEffect(() => {
    let unsubscribe;

    const fetchMyStories = () => {
      if (user) {
        unsubscribe = db
          .collection("stories")
          .where("userId", "==", user?.uid)
          .onSnapshot((snapshot) => {
            setMystories(
              snapshot?.docs.map((doc) => ({
                id: doc?.id,
                ...doc?.data(),
              }))
            );
          });
      }
    };
    fetchMyStories();
    return unsubscribe;
  }, [db, user]);

  const viewStory = (value) => {
    dispatch(openviewStoriesModal());
    dispatch(updateViewedStory(value));
  };
  const navPostStories = (e) => {
    router.push("/storyupload");
  };

  return (
    <div className="flex overflow-scroll scrollbar-thin scrollbar-thumb-black  space-x-2 p-6 bg-white -mt-10 xl:mt-8 mb-4 border-gray-100 border rounded-sm">
      <div
        onClick={navPostStories}
        className="bg-black w-14 h-14 rounded-full p-[1.5px] hover:border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transform transition duration-200 ease-out"
      >
        <AiOutlinePlusCircle className="text-white w-12 h-12" />
      </div>
      {myStoriesUser &&
        myStoriesUser.map((value) => (
          <div
            onClick={() => viewStory(value, "userId")}
            className=""
            key={value}
          >
            <Story key={value.id} userId={value} />
          </div>
        ))}

      {storiesUser &&
        storiesUser.map((value) => (
          <div
            onClick={() => viewStory(value, "userId")}
            className=""
            key={value}
          >
            <Story key={value.id} userId={value} />
          </div>
        ))}
    </div>
  );
}

export default Stories;
