import { useState, useEffect } from "react";
import { getStories, getMyStories } from "./firebase";

export default function usePhotos(newUserData) {
  const [myStories, setMyStories] = useState(null);
  const user = newUserData;

  //console.log(myStories);

  useEffect(() => {
    async function getTimelineStories() {
      // does the user actually follow people?
      if (user?.following?.length > 0) {
        const followedUserStories = await getMyStories(
          user.userId,
          user.following
        );
        // re-arrange array to be newest photos first by dateCreated
        followedUserStories.sort((a, b) => b.dateCreated - a.dateCreated);
        setMyStories(followedUserStories);
      }
    }

    getTimelineStories();
  }, [user?.userId, user?.following]);

  return { myStories };
}
