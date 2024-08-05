import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "@firebase/app";
import { initializeAuth, getReactNativePersistence } from "@firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLNA3jbw2O1UvKBDlMGtLf9IWeMyYqMno",
  authDomain: "aora-17.firebaseapp.com",
  projectId: "aora-17",
  storageBucket: "aora-17.appspot.com",
  messagingSenderId: "1003941264176",
  appId: "1:1003941264176:android:1514354ae63c98c26f26f5",
  measurementId: "",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

const getAllPosts = async () => {
  try {
    const videosCollectionRef = collection(db, "videos");
    const querySnapshot = await getDocs(videosCollectionRef);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching videos:", error);
  }
};

const getAllBookmarkPosts = async (userid) => {
  try {
    const bookmarksCollectionRef = collection(db, "bookmarks");
    const q = query(bookmarksCollectionRef, where("userid", "==", userid));
    const querySnapshot = await getDocs(q);

    const bookmarkPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return bookmarkPosts;
  } catch (error) {
    console.log(error.message);
  }
};

export { app, db, auth, getAllPosts, getAllBookmarkPosts };
