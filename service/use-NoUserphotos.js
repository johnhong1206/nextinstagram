import { useState, useEffect } from "react";
import { getNoUserPhotos } from "./firebase";

export default function usePhotos() {
  const [noUserphotos, setNoUserphoto] = useState(null);

  useEffect(() => {
    async function getTimelinePhotos() {
      const followedUserPhotos = await getNoUserPhotos();

      followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
      setNoUserphoto(followedUserPhotos);
    }

    getTimelinePhotos();
  }, []);

  return { noUserphotos };
}
