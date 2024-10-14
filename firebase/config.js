import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLNA3jbw2O1UvKBDlMGtLf9IWeMyYqMno",
  authDomain: "aora-17.firebaseapp.com",
  projectId: "aora-17",
  storageBucket: "aora-17.appspot.com",
  messagingSenderId: "1003941264176",
  appId: "1:1003941264176:android:1514354ae63c98c26f26f5",
  measurementId: "",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  if (error.code === "auth/already-initialized") {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

export { app, db, storage, auth };
