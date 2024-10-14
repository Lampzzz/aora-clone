import { router } from "expo-router";
import { addDoc, collection } from "@firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "@firebase/auth";

import { isDataExists } from "./firestore";
import { auth, db } from "./config";

const register = async (username, email, password) => {
  try {
    const errors = {};
    const usernameExists = await isDataExists("users", "username", username);
    const emailExists = await isDataExists("users", "email", email);

    if (usernameExists) errors.username = "Username is already in use";
    if (emailExists) errors.email = "Email is already in use";

    if (Object.keys(errors).length > 0) {
      throw { errors };
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await addDoc(collection(db, "users"), {
      auth_id: userCredential.user.uid,
      username,
      email,
    });
  } catch (error) {
    if (!error.errors) {
      throw new Error(error.message || "An unexpected error occurred.");
    }
    throw error;
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(error);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    throw new Error(error);
  }
};

export { register, login, logout };
