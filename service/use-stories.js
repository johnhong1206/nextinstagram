import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addStories } from "../features/storiesSlice";
import { getStories } from "./firebase";

export default function usePhotos(newUserData) {
  const [stories, setStories] = useState(null);
  const user = newUserData;

  useEffect(() => {
    async function getTimelineStories() {
      // does the user actually follow people?
      if (user?.following?.length > 0) {
        const followedUserStories = await getStories(
          user.userId,
          user.following
        );
        // re-arrange array to be newest photos first by dateCreated
        followedUserStories.sort((a, b) => b.dateCreated - a.dateCreated);
        setStories(followedUserStories);
      }
    }

    getTimelineStories();
  }, [user?.userId, user?.following]);

  return { stories };
}
