import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "@firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "@firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
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

const register = async (username, email, password) => {
  try {
    const usernameExists = await checkIfExists("users", "username", username);
    const emailExists = await checkIfExists("users", "email", email);

    if (usernameExists) {
      throw new Error("Username is already in use");
    }

    if (emailExists) {
      throw new Error("Email is already in use");
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await addDoc(collection(db, "users"), {
      uid: userCredential.user.uid,
      username,
      email,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserData = async (uid) => {
  const collectionRef = collection(db, "users");
  const q = query(collectionRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.empty ? null : querySnapshot.docs[0].data();
};

const checkIfExists = async (collectionName, fieldName, fieldValue) => {
  const q = query(
    collection(db, collectionName),
    where(fieldName, "==", fieldValue)
  );
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};

const getAllPosts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "videos"));

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllBookmarkPosts = async (userId) => {
  try {
    const bookmarksSnapshot = await getDocs(
      query(collection(db, "bookmarks"), where("userid", "==", userId))
    );

    const videoIds = bookmarksSnapshot.docs.map((doc) => doc.data().videoid);

    if (videoIds.length === 0) return [];

    const posts = await getAllPosts();
    const bookmarkedPosts = posts.filter((post) => videoIds.includes(post.id));

    return bookmarkedPosts;
  } catch (error) {
    throw new Error(error.message);
  }
};

const searchPosts = async (searchQuery) => {
  try {
    const posts = await getAllPosts();

    const result = posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const newPosts = async (userid, title, videoUri, thumbnailUri) => {
  try {
    await addDoc(collection(db, "videos"), {
      userid,
      title,
      videoUri,
      thumbnailUri,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export {
  app,
  db,
  auth,
  register,
  login,
  getUserData,
  getAllPosts,
  getAllBookmarkPosts,
  searchPosts,
  newPosts,
};
