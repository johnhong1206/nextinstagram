import firebase from "firebase";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDGRd3XryLwMjy9ylyak9Z7SV-d2g0lyj4",
  authDomain: "newinstagram-56e44.firebaseapp.com",
  projectId: "newinstagram-56e44",
  storageBucket: "newinstagram-56e44.appspot.com",
  messagingSenderId: "4969810158",
  appId: "1:4969810158:web:2b291f21ac0a5b1cc94bff",
  measurementId: "G-4KEYYBFKNB",
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error", err.stack);
  }
}

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider, storage };
export default db;
