import { collection, query, where, getDocs } from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    const data = userDoc.data();
    await AsyncStorage.setItem("userCredentials", JSON.stringify(data));

    return data;
  } catch (error) {
    console.error("Error fetching user credentials:", error.message);
    throw error;
  }
};

export default fetchUserCredentials;
