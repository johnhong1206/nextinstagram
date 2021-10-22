import React from "react";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import db, { auth, storage } from "../../config/firebase";
import { BsFillImageFill } from "react-icons/bs";

import { AiFillInstagram } from "react-icons/ai";
import { MdCancel } from "react-icons/md";

import firebase from "firebase";
import { useRouter } from "next/router";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import {
  closepostSotryModal,
  closePostImageModal,
} from "../../features/modalSlice";

function PostImageModal() {
  const [user] = useAuthState(auth);
  const userRedux = useSelector(selectUser);
  const dispatch = useDispatch();

  const inputRef = useRef(null);
  const imgPickerRef = useRef(null);
  const [imgToPost, setImgtoPost] = useState(null);
  const [haveImg, setHaveImg] = useState(false);
  const router = useRouter();

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

  const sendPost = (e) => {
    e.preventDefault();

    if (!user) return false;
    if (!haveImg) return false;

    db.collection("photos")
      .add({
        username: user?.displayName,
        photoId: Date.now(),
        userId: user?.uid,
        caption: inputRef.current.value,
        likes: [],
        comments: [],
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((doc) => {
        if (imgToPost) {
          const uploadTask = storage
            .ref(`images/${doc.id}`)
            .putString(imgToPost, "data_url");

          removeImg();

          uploadTask.on(
            "state_change",
            null,
            (error) => console.error(error),
            () => {
              storage
                .ref("images")
                .child(doc.id)
                .getDownloadURL()
                .then((url) => {
                  db.collection("photos").doc(doc.id).set(
                    {
                      image: url,
                    },
                    {
                      merge: true,
                    }
                  );
                });
            }
          );
        }
      })
      .then(() => {
        router.push("/");
      });

    inputRef.current.value = "";
  };

  return (
    <div className="fixed z-50 inset-1 overflow-y-auto">
      <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 pb-20 text-center sm:block sm:p-0 bg-gray-500 bg-opacity-50 transition-opacity">
        <span
          className="hiddem sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        ></span>
        <div
          className=" inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all
        sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
        >
          <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6">
            {imgToPost && (
              <div
                onClick={removeImg}
                className="flex flex-col items-center justify-center filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer"
              >
                <img
                  className="h-60 w-60 object-contain"
                  src={imgToPost}
                  alt=""
                />
                <p className="text-xs text-red-500 text-center">Remove</p>
              </div>
            )}

            <div className="flex space-x-4 items-center p-4">
              <img
                className="rounded-full h-12 w-12 "
                src={userRedux?.image}
                layout="fixed"
                alt={userRedux?.profileUsername}
              />
              <form className="flex flex-1">
                <input
                  ref={inputRef}
                  className=" rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none"
                  type="text"
                  placeholder={`what's on your mind, ${user?.displayName}`}
                />
                <button hidden onClick={sendPost}>
                  Submit
                </button>
              </form>
            </div>
            <div className="flex items-center justify-between">
              {haveImg && (
                <div className="inputIcon" onClick={sendPost}>
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
              <div
                onClick={() => dispatch(closePostImageModal())}
                className="inputIcon"
              >
                <MdCancel
                  className={`h-8 w-8 text-red-500 cursor-pointer opacity-50 ${
                    !imgPickerRef && "opacity-100"
                  }`}
                />
                <p className="text-xs sm:text-sm lg:text-base">Cancel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostImageModal;
