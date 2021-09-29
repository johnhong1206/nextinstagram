import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
//config
import firebase from "firebase";
import db, { auth } from "../config/firebase";
//components
import Header from "../components/Header";
//service
import { doesUsernameExist } from "../service/firebase";

function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isInvalid = password === "" || email === "";
  const [usernameError, setUsernameError] = useState(null);
  const [fullnameError, setFullnameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const register = async (e) => {
    e.preventDefault();
    //reset errors
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);
    setFullnameError(null);

    //validation
    if (username.length == 0) {
      setUsernameError("Too short");
      return setUsername("");
    }
    if (fullName.length == 0) {
      setFullnameError("Too short");
      return setFullName("");
    }
    if (email.length == 0) {
      setEmailError("invalid Email");
      return setEmail("");
    }
    if (
      !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
        email
      )
    ) {
      setEmailError("invalid email");
      return setEmail("");
    }
    if (password.length == 0) {
      setPasswordError("Too short");
      return setPassword("");
    }
    const usernameExists = await doesUsernameExist(username);
    if (!usernameExists) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          const uid = response.user.uid;

          const usersRef = db.collection("users");
          usersRef.doc(uid).set({
            userId: response.user.uid,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            fullName: fullName,
            following: [],
            followers: [],
            dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL:
              "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg",
          });
        })
        .then((authUser) => {
          const Updateuser = auth.currentUser;
          Updateuser.updateProfile({
            displayName: username,
            photoURL:
              "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg",
          });
        })
        .catch((error) => alert(error.message))
        .then((auth) => {
          //create user and logged in, redirect to homepage
          router.replace("/");
        });
    } else {
      setUsername("");
      setError("That username is already taken, please try another.");
    }
  };

  return (
    <div className=" container h-screen p-4 lg:p-0">
      <Head>
        <title>ZH Instagram - Register</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex mx-auto max-w-screen-md items-center p-4">
        <div className="hidden lg:flex w-3/5">
          <img
            src="/images/iphone-with-profile.jpg"
            alt="iphone-with-instagram-app"
          />
        </div>
        <div className="flex flex-col w-full lg:w-2/5">
          <h1 className="flex justify-center w-full">
            <img src="/images/logo.png" alt="logo" />
          </h1>
          {error && <p className="mb-4 text-xs text-red-400">{error}</p>}
          <form onSubmit={register} method="POST">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              arial-label="Enter your username"
              placeholder={usernameError === null ? "Username" : usernameError}
              className={`text-sm text-gray-500 w-full pr-3 py-5 px-4 border border-gray-primary rounded mb-2 focus-within:shadow-lg outline-none
            ${usernameError !== null && "border-2 border-red-500"}`}
            />
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              arial-label="Enter your Full Name"
              placeholder={usernameError === null ? "Fullname" : fullnameError}
              className={`text-sm text-gray-500 w-full pr-3 py-5 px-4 border border-gray-primary rounded mb-2 focus-within:shadow-lg outline-none
          ${fullnameError !== null && "border-2 border-red-500"}`}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              arial-label="Enter your email"
              placeholder={emailError === null ? "Email" : emailError}
              className={`text-sm text-gray-500 w-full pr-3 py-5 px-4 border border-gray-primary rounded mb-2 focus-within:shadow-lg outline-none
            ${emailError !== null && "border-2 border-red-500"}`}
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              arial-label="Enter your password"
              placeholder={passwordError === null ? "Password" : passwordError}
              className={`text-sm text-gray-500 w-full pr-3 py-5 px-4 border border-gray-primary rounded mb-2 focus-within:shadow-lg outline-none
            ${passwordError !== null && "border-2 border-red-500"}`}
            />
            <button
              onClick={register}
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-500 text-white w-full rounded h-10 lg:h-8 font-bold hover:shadow-xl ${
                isInvalid && "opacity-50 "
              }`}
            >
              Register
            </button>
          </form>
          <div className="flex justify-center flex-col w-full bg-white p-4 border border-gray-100">
            <p>
              Do have account?
              <span
                onClick={() => router.push("/login")}
                className="ml-1 hover:underline cursor-pointer"
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;
