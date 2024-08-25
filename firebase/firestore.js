import { db } from "./config";
import { uploadFile } from "./storage";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  limit,
} from "@firebase/firestore";

const isDataExists = async (collectionName, fieldName, fieldValue) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(fieldName, "==", fieldValue)
    );
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null;
  }
};

const getUserData = async (uid) => {
  try {
    const userQuery = query(
      collection(db, "users"),
      where("auth_id", "==", uid),
      limit(1)
    );
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return null;
    }

    return { id: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const getAllPosts = async () => {
  try {
    const postsQuery = await getDocs(collection(db, "posts"));
    const posts = postsQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (posts.empty) return [];

    return posts;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllUserPosts = async (uid) => {
  try {
    const q = query(collection(db, "posts"), where("user_id", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return [];

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
      query(collection(db, "bookmarks"), where("user_id", "==", uid))
    );

    const bookmarks = bookmarksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (bookmarks.length === 0) return [];

    const posts = await getAllPosts();
    const bookmarkedPosts = posts.filter((post) =>
      bookmarks.some((bookmark) => bookmark.video_id === post.id)
    );

    const results = bookmarkedPosts.map((post) => {
      post.video_id = post.id;

      const bookmark = bookmarks.find(
        (bookmark) => bookmark.video_id === post.video_id
      );

      return {
        id: bookmark.id,
        user_id: bookmark.user_id,
        video_id: post.video_id,
        title: post.title,
        creator: post.creator,
        thumbnail_url: post.thumbnail_url,
        video_url: post.video_url,
        createdAt: post.createdAt,
      };
    });

    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const newPosts = async (uid, creator, title, videoUri, thumbnailUri) => {
  try {
    const videoURL = await uploadFile("posts", videoUri);
    const thumbnailURL = await uploadFile("posts", thumbnailUri);

    await addDoc(collection(db, "posts"), {
      user_id: uid,
      creator,
      title,
      video_url: videoURL,
      thumbnail_url: thumbnailURL,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const toggleBookmark = async (userId, videoId) => {
  try {
    const bookmarksSnapshot = await getDocs(
      query(
        collection(db, "bookmarks"),
        where("user_id", "==", userId),
        where("video_id", "==", videoId)
      )
    );

    if (!bookmarksSnapshot.empty) {
      const bookmarkDoc = bookmarksSnapshot.docs[0];
      await deleteDoc(doc(db, "bookmarks", bookmarkDoc.id));
    } else {
      await addDoc(collection(db, "bookmarks"), {
        useru_id: userId,
        video_id: videoId,
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export {
  getUserData,
  isDataExists,
  getAllBookmarkPosts,
  getAllPosts,
  getAllUserPosts,
  toggleBookmark,
  newPosts,
};
