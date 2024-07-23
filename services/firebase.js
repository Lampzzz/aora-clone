import { initializeApp } from "@firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  getDocs,
  where,
} from "@firebase/firestore";
import { getAuth } from "@firebase/auth";

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
const auth = getAuth(app);

export { app, db, auth, collection, addDoc, query, getDocs, where };
