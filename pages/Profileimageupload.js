import { useRef, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header/Header";
import db, { storage } from "../config/firebase";
import { BsFillImageFill } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai";

function Profileimageupload() {
  const { user } = useAuth();
  const [userData, setUserData] = useState([]);
  const imgPickerRef = useRef(null);
  const [imgToPost, setImgtoPost] = useState(null);
  const [haveImg, setHaveImg] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe;
    const fetchUserData = () => {
      unsubscribe = db
        .collection("users")
        .doc(user?.uid)
        .onSnapshot((snapshot) => setUserData(snapshot.data()));
    };
    fetchUserData();
    return unsubscribe;
  }, [db, user]);

  const addImgtoPost = (e) => {
    const reader = new FileReader();
    setHaveImg(true);
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImgtoPost(readerEvent.target.result);
    };
  };

  const removeImg = () => {
    setHaveImg(false);
    setImgtoPost(null);
  };

  const upload = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user) return false;
    if (!haveImg) return false;

    db.collection("users")
      .doc(user?.uid)
      .set({ photoURL: userData?.photoURL }, { merge: true })
      .then((doc) => {
        if (imgToPost) {
          const uploadTask = storage
            .ref(`ProfileImages/${user?.uid}`)
            .putString(imgToPost, "data_url");

          removeImg();

          uploadTask.on(
            "state_change",
            null,
            (error) => console.error(error),
            () => {
              storage
                .ref("ProfileImages")
                .child(user?.uid)
                .getDownloadURL()
                .then((url) => {
                  db.collection("users")
                    .doc(user?.uid)
                    .set(
                      {
                        photoURL: url,
                      },
                      {
                        merge: true,
                      }
                    )
                    .then(() => {
                      router.push(`/profile/${user?.uid}`);
                      setLoading(false);
                    });
                });
            }
          );
        }
      });
  };

  return (
    <>
      <Head>
        <title>{userData?.username} Image Upload</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6">
        {imgToPost ? (
          <div
            onClick={removeImg}
            className="flex flex-col items-center justify-center filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer"
          >
            <img className="h-60 w-60 object-contain" src={imgToPost} alt="" />
            <p className="text-xs text-red-500 text-center">Remove</p>
          </div>
        ) : (
          <h1 className="text-xl  text-center mt-10">
            {!loading ? "Please Pick Your Photo" : " Uploading ..."}
          </h1>
        )}

        <div className="flex space-x-4 items-center justify-center p-4">
          <form className="flex flex-1">
            <button hidden onClick={upload}>
              Submit
            </button>
          </form>
        </div>
        <div className="px-10 flex items-center justify-center space-x-12 p-3 border-t overflow-x-scroll md:overflow-x-hidden">
          <img
            className="rounded-full h-20 w-20 "
            src={userData?.photoURL}
            layout="fixed"
            alt={userData?.username}
          />
          {haveImg && (
            <div className="inputIcon" onClick={upload}>
              <AiFillInstagram
                className={`h-8 w-8 text-pink-500 cursor-pointer opacity-50 ${
                  !imgPickerRef && "opacity-100"
                }`}
              />
              <p className="text-xs sm:text-sm lg:text-base">Upload</p>
            </div>
          )}
          <div
            className="inputIcon"
            onClick={() => imgPickerRef.current.click()}
          >
            <BsFillImageFill className="h-8 w-8 text-green-500 cursor-pointer" />
            <p className="text-xs sm:text-sm lg:text-base">Photo/Video</p>
            <input
              ref={imgPickerRef}
              type="file"
              hidden
              onChange={addImgtoPost}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profileimageupload;
