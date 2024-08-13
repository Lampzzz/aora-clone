import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "@firebase/app";
import { router } from "expo-router";
import uuid from "react-native-uuid";
import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
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
import {
  getStorage,
  getDownloadURL,
  uploadBytes,
  ref,
} from "@firebase/storage";

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
const storage = getStorage(app);

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
    const postsQuerySnapshot = await getDocs(collection(db, "posts"));
    const posts = postsQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const postsWithUserData = await Promise.all(
      posts.map(async (post) => {
        const userData = await getUserData(post.uid);
        return {
          ...post,
          user: userData,
        };
      })
    );

    return postsWithUserData;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllUserPosts = async (uid) => {
  try {
    const q = query(collection(db, "posts"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return posts;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllBookmarkPosts = async (uid) => {
  try {
    const bookmarksSnapshot = await getDocs(
      query(collection(db, "bookmarks"), where("uid", "==", uid))
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

const newPosts = async (uid, title, videoUri, thumbnailUri) => {
  try {
    const videoURL = await uploadFile("posts", videoUri);
    const thumbnailURL = await uploadFile("posts", thumbnailUri);

    await addDoc(collection(db, "posts"), {
      uid,
      title,
      video: videoURL,
      thumbnail: thumbnailURL,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const uploadFile = async (path, uri) => {
  try {
    const fileRef = ref(storage, `${path}${uuid.v4()}`);
    const response = await fetch(uri);
    const fileBlob = await response.blob();

    await uploadBytes(fileRef, fileBlob);

    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
  } catch (error) {
    throw new Error(error.message);
  }
};

const toggleBookmark = async (userId, videoId) => {
  try {
    const bookmarksSnapshot = await getDocs(
      query(
        collection(db, "bookmarks"),
        where("uid", "==", userId),
        where("videoid", "==", videoId)
      )
    );

    if (!bookmarksSnapshot.empty) {
      const bookmarkDoc = bookmarksSnapshot.docs[0];
      await deleteDoc(doc(db, "bookmarks", bookmarkDoc.id));
    } else {
      await addDoc(collection(db, "bookmarks"), {
        uid: userId,
        videoid: videoId,
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    router.push("/");
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
  getAllUserPosts,
  getAllPosts,
  getAllBookmarkPosts,
  searchPosts,
  newPosts,
  logout,
};
