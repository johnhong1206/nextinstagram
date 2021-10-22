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

{
  /*

const firebaseConfig = {
  apiKey: "AIzaSyCJGyPIIiHZSRuFF4Q9vRdEClaSggjHztI",
  authDomain: "instagram-66ebe.firebaseapp.com",
  projectId: "instagram-66ebe",
  storageBucket: "instagram-66ebe.appspot.com",
  messagingSenderId: "553675951179",
  appId: "1:553675951179:web:bd64f54d31df9ad26311ce",
  measurementId: "G-YN6CLQ2BBG"
};



const firebaseConfig = {
  apiKey: "AIzaSyDGRd3XryLwMjy9ylyak9Z7SV-d2g0lyj4",
  authDomain: "newinstagram-56e44.firebaseapp.com",
  projectId: "newinstagram-56e44",
  storageBucket: "newinstagram-56e44.appspot.com",
  messagingSenderId: "4969810158",
  appId: "1:4969810158:web:2b291f21ac0a5b1cc94bff",
  measurementId: "G-4KEYYBFKNB",
};



*/
}
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
