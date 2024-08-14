import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "@firebase/firestore";

// Check if the data is exist in the collection
const isExists = async (collectionName, fieldName, fieldValue) => {
  const q = query(
    collection(db, collectionName),
    where(fieldName, "==", fieldValue)
  );
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};

// Get all the posts created by all users
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

// Get all the posts that created by current subscribe user
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

// Get all the posts that bookmarked my current subscribe user
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

// Create a new posts
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

// Add & Remove Post Bookmark
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

export {
  isExists,
  getAllBookmarkPosts,
  getAllPosts,
  getAllUserPosts,
  toggleBookmark,
  newPosts,
};
