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
  deleteDoc,
  doc,
  getDoc,
  setDoc,
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

    if (!userSnapshot.empty) {
      return { id: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() };
    }

    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }

    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const getAllPosts = async () => {
  try {
    const postsQuery = await getDocs(collection(db, "posts"));

    const posts = await Promise.all(
      postsQuery.docs.map(async (doc) => {
        const user = await getUserData(doc.data().user_id);
        if (!user) throw new Error("User not found");

        return {
          id: doc.id,
          creator: user.username,
          ...doc.data(),
        };
      })
    );

    if (posts.empty) return [];

    return posts;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllUserPosts = async (uid) => {
  try {
    const userPostquery = query(
      collection(db, "posts"),
      where("user_id", "==", uid)
    );
    const querySnapshot = await getDocs(userPostquery);

    if (querySnapshot.empty) return [];

    const userPosts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const user = await getUserData(doc.data().user_id);
        if (!user) throw new Error("User not found");

        return {
          id: doc.id,
          creator: user.username,
          ...doc.data(),
        };
      })
    );

    return userPosts;
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

    // User Details
    const user = await getUserData(uid);
    if (!user) throw new Error("User not found");

    // Post Details
    const posts = await getAllPosts();
    const bookmarkedPosts = posts.filter((post) =>
      bookmarks.some((bookmark) => bookmark.post_id === post.id)
    );

    const results = bookmarkedPosts.map((post) => {
      post.post_id = post.id;

      const bookmark = bookmarks.find(
        (bookmark) => bookmark.post_id === post.post_id
      );

      return {
        id: bookmark.id,
        user_id: bookmark.user_id,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        post: {
          id: post.post_id,
          title: post.title,
          creator: post.creator,
          thumbnail_url: post.thumbnail_url,
          video_url: post.video_url,
          createdAt: post.createdAt,
        },
      };
    });

    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const newPost = async (userId, title, video_url, thumbnail_uri) => {
  try {
    const videoURL = await uploadFile("video", video_url);
    const thumbnailURL = await uploadFile("thumbnail", thumbnail_uri);

    await addDoc(collection(db, "posts"), {
      user_id: userId,
      title,
      video: videoURL,
      thumbnail: thumbnailURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const toggleBookmark = async (userId, videoId) => {
  try {
    let bookmarkMessage = "";

    const bookmarksSnapshot = await getDocs(
      query(
        collection(db, "bookmarks"),
        where("user_id", "==", userId),
        where("post_id", "==", videoId)
      )
    );

    if (!bookmarksSnapshot.empty) {
      const bookmarkDoc = bookmarksSnapshot.docs[0];
      await deleteDoc(doc(db, "bookmarks", bookmarkDoc.id));

      bookmarkMessage = "Removed from bookmark";
    } else {
      await addDoc(collection(db, "bookmarks"), {
        user_id: userId,
        post_id: videoId,
      });

      bookmarkMessage = "Added to bookmark";
    }

    return bookmarkMessage;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPost = async (postId) => {
  try {
    const post = await getDoc(doc(db, "posts", postId));

    return { id: post.id, ...post.data() };
  } catch (error) {
    throw new Error(error.message);
  }
};

const editPost = async (postId, data) => {
  try {
    const videoURL = await uploadFile("posts", data.video_url);
    const thumbnailURL = await uploadFile("posts", data.thumbnail_url);

    const postRef = doc(db, "posts", postId);

    await setDoc(postRef, {
      ...data,
      video_url: videoURL,
      thumbnail_url: thumbnailURL,
      updatedAt: serverTimestamp(),
    });

    const postSnapshot = await getDoc(postRef);

    if (!postSnapshot.exists()) {
      throw new Error("Post not found");
    }

    return { id: postSnapshot.id, ...postSnapshot.data() };
  } catch (error) {
    throw new Error(error.message);
  }
};

const deletePost = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);
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
  newPost,
  getPost,
  editPost,
  deletePost,
};
