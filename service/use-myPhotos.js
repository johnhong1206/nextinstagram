import { useState, useEffect } from "react";
import { getPhotos, getMyPhotos } from "./firebase";

export default function usePhotos(newUserData) {
  const [photos, setPhotos] = useState(null);
  const [myphotos, setMyPhotos] = useState(null);

  const user = newUserData;

  useEffect(() => {
    async function getTimelinePhotos() {
      // does the user actually follow people?
      if (user) {
        const myPhotos = await getMyPhotos(user.userId, user.following);
        // re-arrange array to be newest photos first by dateCreated
        myPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
        setMyPhotos(myPhotos);
        console.log(myphotos);
      }
    }
    getTimelinePhotos();
  }, [user?.userId]);

  return { myphotos };
}
