//components
import User from "./User";
import Suggestion from "./Suggestion";
import Skeleton from "react-loading-skeleton";
//config
import db, { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";

function Sidebar() {
  const [user] = useAuthState(auth);
  const [userData, loading] = useDocument(
    user && db.collection("users").doc(user?.uid)
  );
  if (loading) return <Skeleton count={1} height={61} />;

  return (
    <div className="hidden lg:grid">
      <div>
        <User
          username={userData?.data().username}
          fullName={userData?.data().fullName}
          image={userData?.data().photoURL}
          uid={userData?.data().userId}
        />
        <Suggestion
          userId={userData?.data().userId}
          following={userData?.data().following}
          loggedInUserDocId={userData?.id}
        />
      </div>
    </div>
  );
}

export default Sidebar;
