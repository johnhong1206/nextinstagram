import "../styles/globals.css";

//redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "../store/store";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "./loading";
import { AuthProvider } from "../hooks/useAuth";

const progress = new ProgressBar({
  size: 4,
  color: "#4c68d7",
  className: "z-50",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

let persistor = persistStore(store);

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return <Loading />;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
