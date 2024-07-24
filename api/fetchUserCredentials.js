import { collection, query, where, getDocs } from "@firebase/firestore";
import { db } from "../services/firebase";

const fetchUserCredentials = async (uid) => {
  try {
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents found!");
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    return userDoc.data();
  } catch (error) {
    console.error("Error fetching user credentials:", error.message);
    throw error;
  }
};

export default fetchUserCredentials;
