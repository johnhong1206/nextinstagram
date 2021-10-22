import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import db, { auth } from "../../../config/firebase";
import Story from "./Story";
import useStories from "../../../service/use-stories";
import { getUniqueValues } from "../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import {
  openpostStoriesModal,
  openviewStoriesModal,
} from "../../../features/modalSlice";
import {
  addStories,
  allStories,
  updateViewedStory,
} from "../../../features/storiesSlice";
import { updateFilters } from "../../../../ecommerce/features/cartSlice";
import { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";

function Stories() {
  const [user] = useAuthState(auth);
  const userRef = db.collection("users").doc(user?.uid);
  const [userData, loading] = useDocument(user && userRef);
  const userId = user?.uid;
  const following = userData?.data().following;
  const newUserData = { userId, following };
  const all_stories = useSelector(allStories);
  const dispatch = useDispatch();
  const [lastChange, setLastChange] = useState(null);
  const { stories } = useStories(newUserData);

  const storiesUser = stories ? getUniqueValues(stories, "userId") : null;

  const opentoPostStoryModal = () => {
    dispatch(openpostStoriesModal());
  };

  const filterUsesrStory = (value, item) => {
    dispatch(openviewStoriesModal());

    const filtered = all_stories.filter((stories) =>
      stories[item].includes(value)
    );
    dispatch(updateViewedStory(filtered));
  };

  const viewStory = (value) => {
    dispatch(openviewStoriesModal());
    dispatch(updateViewedStory(value));
  };

  return (
    <div className="flex overflow-scroll scrollbar-thin scrollbar-thumb-black  space-x-2 p-6 bg-white -mt-10 xl:mt-8 mb-4 border-gray-100 border rounded-sm">
      <div
        onClick={opentoPostStoryModal}
        className="bg-black w-14 h-14 rounded-full p-[1.5px] hover:border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transform transition duration-200 ease-out"
      >
        <AiOutlinePlusCircle className="text-white w-12 h-12" />
      </div>

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
