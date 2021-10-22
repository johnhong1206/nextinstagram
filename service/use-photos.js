import { useState, useEffect } from "react";
import { getPhotos, getMyPhotos } from "./firebase";

export default function usePhotos(newUserData) {
  const [photos, setPhotos] = useState(null);
  const [myphotos, setMyPhotos] = useState(null);
  const user = newUserData;

  //console.log("photos", photos);
  //console.log("myphotos", myphotos);

  useEffect(() => {
    async function getTimelinePhotos() {
      // does the user actually follow people?
      if (user?.following?.length > 0) {
        const followedUserPhotos = await getPhotos(user.userId, user.following);
        //const myPostPhotos = await getMyPhotos(user.userId, user.following);
        // re-arrange array to be newest photos first by dateCreated
        followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
        //myPostPhotos.sort((a, b) => b.dateCreated - a.dateCreated);

        // re-arrange array to be newest photos first by dateCreated
        setPhotos(followedUserPhotos);
        //setMyPhotos(myphotos);
      }
    }

    getTimelinePhotos();
  }, [user?.userId, user?.following]);

  return { photos };
}
