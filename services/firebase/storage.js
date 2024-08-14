import uuid from "react-native-uuid";
import { getDownloadURL, uploadBytes, ref } from "@firebase/storage";

import { storage } from "./config";

// Upload file in the firebase storage
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

export { uploadFile };
