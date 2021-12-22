import { useEffect, useState } from "react";
const Header = dynamic(() => import("../../components/Header/Header"));
import dynamic from "next/dynamic";
import db from "../../config/firebase";

import Head from "next/head";
import { useSelector } from "react-redux";
import { selectMenuModalIsOpen } from "../../features/modalSlice";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/router";
import Image from "next/image";
import moment from "moment";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import Link from "next/link";
import AddComment from "../../components/Posts/AddComment";

function Photo() {
  const menuModal = useSelector(selectMenuModalIsOpen);
  const { user } = useAuth();
  const [userData, setUserData] = useState([]);
  const [photoUserData, setPhotoUserData] = useState([]);
  const userImage = userData?.photoURL;

  const [photo, setPhoto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsSlice, setCommentsSlice] = useState(2);
  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 2);
  };

  const router = useRouter();

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
    db.collection("photos")
      .doc(router.query.id)
      .get()
      .then((documentSnapshot) => {
        setLoading(true);
        if (!documentSnapshot.exists) {
        } else {
          setLoading(false);
          setPhoto(documentSnapshot.data());
        }
      });
  }, [db, router.query.id]);

  useEffect(() => {
    db.collection("photos")
      .doc(router.query.id)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setComments(
          snapshot?.docs.map((doc) => ({
            id: doc?.id,
            ...doc?.data(),
          }))
        );
      });
  }, [db, router.query.id]);

  useEffect(() => {
    let unsubscribe;

    const fetchUserData = async () => {
      unsubscribe = db
        .collection("users")
        .doc(photo?.userId)
        .get()
        .then((documentSnapshot) => {
          if (!documentSnapshot.exists) {
            console.log("nodata");
          } else {
            //console.log('User data: ', documentSnapshot.data());
            setPhotoUserData(documentSnapshot.data());
          }
        });
    };
    fetchUserData();
    return unsubscribe;
  }, [db, photo?.userId]);

  const navProfile = () => {
    router.back();
  };

  return (
    <div>
      <Header userData={userData} goback navProfile={navProfile} />
      <main className="mx-auto xl:max-w-6xl bg-white shadow-lg flex-1">
        {loading ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className="flex flex-col  items-start w-full">
            <div className="flex items-baseline justify-between border-b border-gray-300 w-full">
              <div className="flex border-b border-gray-primary h-4 p-4 py-8">
                <div className="flex items-center">
                  <Link
                    href={`/profile/${photo?.userId}`}
                    className="flex items-center"
                  >
                    <img
                      src={photoUserData.photoURL}
                      className="rounded-full h-8 w-8 flex mr-3 cursor-pointer"
                      alt={`${photo?.username} profile picture`}
                    />
                  </Link>
                  <div className="flex flex-col">
                    <Link
                      href={`/profile/${photo?.userId}`}
                      className="flex items-center cursor-pointer"
                    >
                      <p className="font-bold">{photo?.username}</p>
                    </Link>
                    <p className="text-xs text-gray-400">
                      {moment(photo?.timestamp?.toDate().getTime()).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <BiDotsHorizontalRounded className="w-8 h-8 mr-4 cursor-pointer hover:bg-gray-100 rounded-full hover:opacity-90" />
            </div>
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="flex items-center justify-center xl:ml-10 p-2 group cursor-pointer transition duration-200 ease-in transform sm:hover:scale-105 hover:z-50">
                <img
                  loading="lazy"
                  src={photo?.image}
                  objectFit="contain"
                  width={600}
                  height={600}
                  quality="50"
                  alt="save image"
                />
              </div>
              <div>
                <div className="p-4 pt-2 pb-1">
                  <span className="mr-1 font-bold">{photo?.username}</span>
                  <span className="italic">{photo?.caption}</span>
                </div>
                <div className="p-4 pt-2 pb-1">
                  {comments?.slice(0, commentsSlice).map((item) => (
                    <div key={item?.id} className="my-2">
                      <p
                        key={`${item.comment}-${item.displayName}`}
                        className=""
                      >
                        <Link href={`/p/${item.displayName}`}>
                          <span className="mr-1 font-bold">
                            {item.displayName}
                          </span>
                        </Link>
                        <span>{item.comment}</span>
                      </p>
                      <p className="text-xs font-light italic text-gray-400">
                        {moment(item?.timestamp?.toDate().getTime()).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </p>
                    </div>
                  ))}
                  {comments?.length >= 2 && commentsSlice < comments?.length && (
                    <button
                      className="text-sm text-gray-base mb-1 cursor-pointer focus:outline-none"
                      type="button"
                      onClick={showNextComments}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          showNextComments();
                        }
                      }}
                    >
                      View more comments
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full">
              {user && (
                <AddComment
                  docId={router.query.id}
                  comments={comments}
                  setComments={setComments}
                />
              )}
            </div>
          </div>
        )}
      </main>
      <div className="pb-10" />
    </div>
  );
}

export default Photo;
export async function getServerSideProps(context) {
  const photoRef = db.collection("photos").doc(context.query.id);

  const photoRes = await photoRef.get();
  const photo = { id: photoRes.id, ...photoRes.data() };
  return {
    props: {
      photo: JSON.stringify(photo),
    },
  };
}
