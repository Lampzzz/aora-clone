import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "@firebase/app";
import { getFirestore, collection, getDocs } from "@firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "@firebase/auth";

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

// Get all video posts
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
    throw error;
  }
};

const subscribeToPosts = (callback) => {
  const q = query(collection(db, "videos"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(posts);
  });
  return unsubscribe;
};

export { app, db, auth, getAllPosts, subscribeToPosts };
