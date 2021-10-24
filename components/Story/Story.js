import { useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useDispatch } from "react-redux";
import db from "../../config/firebase";

function Story({ key, userId, content }) {
  const dispatch = useDispatch();

  const [story, setStory] = useState([]);
  const userRef = db.collection("users").doc(userId);
  const [userData] = useDocument(userId && userRef);
  const userImage = userData?.data().photoURL;

  return (
    <div key={key}>
      <img
        src={userImage}
        className="w-14 h-14 rounded-full p-[1.5px] border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transform transition duration-200 ease-out"
      />
    </div>
  );
}

export default Story;
