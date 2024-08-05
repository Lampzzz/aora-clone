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

    return;
  } catch (error) {
    throw new Error(error.message);
  }
};

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await AsyncStorage.setItem("user", JSON.stringify(userCredential.user));
    await fetchUserData(userCredential.user.uid);
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchUserData = async (uid) => {
  try {
    const userDoc = await getUserDocument(uid);
    if (!userDoc) throw new Error("No matching documents found!");
    await AsyncStorage.setItem("userInfo", JSON.stringify(userDoc));
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
};

const getUserDocument = async (uid) => {
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
    console.error("Error fetching posts:", error.message);
  }
};

const getAllBookmarkPosts = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "bookmarks"), where("userid", "==", userId))
    );
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching bookmarks:", error.message);
  }
};

const searchPosts = async (searchQuery) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "videos"), where("title", "==", searchQuery))
    );
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error searching posts:", error.message);
    throw error;
  }
};

export {
  app,
  db,
  auth,
  register,
  login,
  getAllPosts,
  getAllBookmarkPosts,
  searchPosts,
};
