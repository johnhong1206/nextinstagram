import Posts from "../../Posts/Posts";
import NoLoginPost from "../../Posts/NoLoginPost";
import Skeleton from "react-loading-skeleton";

//config
import db, { auth } from "../../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import usePhotos from "../../../service/use-photos";
import useMyPhotos from "../../../service/use-myPhotos";

import useNoUserphotos from "../../../service/use-NoUserphotos";
import { useEffect, useState } from "react";
import { getNoUserPhotos } from "../../../service/firebase";
import NoUserPosts from "../../Posts/NoUserPosts";

function Timeline({ noUserphotos }) {
  const [user] = useAuthState(auth);
  const userRef = db.collection("users").doc(user?.uid);
  const [userData, loading] = useDocument(user && userRef);
  const [allPhotos, setAllPhotos] = useState(null);
  const userId = user?.uid;
  const following = userData?.data().following;
  const newUserData = { userId, following };
  const { photos } = usePhotos(newUserData);
  const { myphotos } = useMyPhotos(newUserData);

  const photoRef = db.collection("photos").orderBy("timestamp", "asc");
  const [photoSnapshot, photoSnapshotloading] = useCollection(photoRef);

  if (photoSnapshotloading) return <Skeleton count={1} height={61} />;
  if (loading) return <Skeleton count={4} height={61} />;

  return (
    <div className="container p-4 lg:p-0 col-span-3 lg:col-span-2">
      {!noUserphotos ? (
        <Skeleton count={1} height={61} />
      ) : (
        <>
          {!user &&
            noUserphotos
              ?.slice(0, 2)
              .map((content) => (
                <NoUserPosts key={content.docId} content={content} />
              ))}
          {!user && (
            <>
              <h1 className="text-center font-bold">
                Please Login to View More
              </h1>
              <div className="pb-1 lg:pb-10" />
            </>
          )}
        </>
      )}
      {!user ? (
        <></>
      ) : !!myphotos?.length ? (
        myphotos?.map((content) => (
          <Posts key={content.docId} content={content} />
        ))
      ) : (
        <></>
      )}

      {!photos ? (
        <></>
      ) : (
        photos.map((content) => <Posts key={content.docId} content={content} />)
      )}
    </div>
  );
}

export default Timeline;

{
  /**
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 

 {!noUserphotos ? (
        <Skeleton count={1} height={61} />
      ) : (
        <>
          {!user &&
            noUserphotos
              ?.slice(0, 2)
              .map((content) => (
                <NoUserPosts key={content.docId} content={content} />
              ))}
          {!user && (
            <>
              <h1 className="text-center font-bold">
                Please Login to View More
              </h1>
              <div className="pb-1 lg:pb-10" />
            </>
          )}
        </>
      )}
      {!user ? (
        <></>
      ) : !!myphotos?.length ? (
        myphotos?.map((content) => (
          <Posts key={content.docId} content={content} />
        ))
      ) : (
        <></>
      )}
      
      
      
      
      
      
      
      * {!user &&
        photoSnapshot?.docs.slice(0, 2).map((content) => (
          <>
            <NoLoginPost
              key={content.id}
              id={content.id}
              profileId={content?.data().userId}
              content={content?.data()}
              username={content?.data().username}
              userId={content?.data().userId}
              timestamp={content?.data().timestamp?.toDate().getTime()}
              image={content?.data().image}
            />
            <h1 className="text-center font-bold">Please Login to View More</h1>
            <div className="pb-1 lg:pb-10" />
          </>
        ))} 
        
        
        
        
        
         useEffect(() => {
    async function getTimelinePhotos() {
      const followedUserPhotos = await getNoUserPhotos();

      followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
      setNoUserphoto(followedUserPhotos);
    }

    getTimelinePhotos();
  }, []);

        */
}
