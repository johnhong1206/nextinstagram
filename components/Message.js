import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import moment from "moment";
import db from "../config/firebase";
import { useDocument } from "react-firebase-hooks/firestore";

function Message({ username, message, email, photoURL, userId }) {
  const [user, loading] = useAuthState(auth);
  const userRef = db.collection("users").doc(userId);
  const [userData] = useDocument(userId && userRef);
  const userImage = userData?.data().photoURL;

  return (
    <div className="p-4 mt-0 lg:mt-4">
      <div className="relative">
        <div
          className={`absolute ${
            email === user?.email ? "right-0 " : "left-0"
          }`}
        >
          <p
            className={`relative p-2 text-base rounded-3xl font-mono shadow-md  ${
              email === user?.email
                ? "bg-green-300 text-left"
                : "bg-pink-300 text-right"
            }`}
          >
            <img
              src={userImage}
              className={`rounded-full w-8 h-8 absolute ${
                email !== user?.email
                  ? "-left-2 -bottom-2"
                  : "-right-2 -bottom-2"
              }`}
            />
            {message.message}
          </p>

          <div className="flex items-baseline space-x-2 mt-2">
            <h3 className="text-lg font-medium text-gray-200">{username}</h3>
            <p className="text-gray-400 text-xs">
              {message.timestamp
                ? moment(message.timestamp).format("LT")
                : "..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
