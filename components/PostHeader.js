import Link from "next/link";
import db from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import moment from "moment";

function PostHeader({ username, userDocId, timestamp }) {
  const userRef = db.collection("users").doc(userDocId);
  const [userData] = useDocument(userDocId && userRef);
  const userImage = userData?.data().photoURL;
  const userId = userData?.data().userId;

  return (
    <div className="flex items-baseline justify-between border-b border-gray-300 ">
      <div className="flex border-b border-gray-primary h-4 p-4 py-8">
        <div className="flex items-center">
          <Link href={`/profile/${userId}`} className="flex items-center">
            <img
              loading="lazy"
              src={userImage}
              className="rounded-full h-8 w-8 flex mr-3 cursor-pointer"
              alt={`${username} profile picture`}
            />
          </Link>
          <div className="flex flex-col">
            <Link
              href={`/profile/${userId}`}
              className="flex items-center cursor-pointer"
            >
              <p className="font-bold">{username}</p>
            </Link>
            <p className="text-xs text-gray-400">
              {moment(timestamp).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
          </div>
        </div>
      </div>
      <BiDotsHorizontalRounded className="w-8 h-8 mr-4 cursor-pointer hover:bg-gray-100 rounded-full hover:opacity-90" />
    </div>
  );
}

export default PostHeader;
