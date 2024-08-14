import { router } from "expo-router";
import { collection, addDoc } from "@firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "@firebase/auth";

import { isExists } from "./firestore";

const register = async (username, email, password) => {
  try {
    const usernameExists = await isExists("users", "username", username);
    const emailExists = await isExists("users", "email", email);

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

const logout = async () => {
  try {
    await signOut(auth);
    router.push("/");
  } catch (error) {
    throw new Error(error.message);
  }
};

export { register, login, logout };
