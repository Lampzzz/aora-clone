import { useGlobalContext } from "../context/GlobalProvider";
import { addDoc, collection, deleteDoc, doc } from "@firebase/firestore";

import { db } from "../services/firebase";

const toggleBookmark = async (id) => {
  try {
    const { bookmarkPosts, setBookmarkPosts, userCredentials } =
      useGlobalContext();

    if (!userCredentials) throw new Error("User not found");

    const isBookmarked = bookmarkPosts.some(
      (bookmark) => bookmark.videoid === id
    );

    if (isBookmarked) {
      // Remove bookmark
      const bookmark = bookmarkPosts.find(
        (bookmark) => bookmark.videoid === id
      );
      await deleteDoc(doc(db, "bookmarks", bookmark.id));
      setBookmarkPosts(
        bookmarkPosts.filter((bookmark) => bookmark.videoid !== id)
      );
    } else {
      // Add bookmark
      const newBookmark = await addDoc(collection(db, "bookmarks"), {
        uid: userCredentials.userId,
        videoid: id,
      });

      setBookmarkPosts([
        ...bookmarkPosts,
        { id: newBookmark.id, ...newBookmark.data() },
      ]);
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
  }
};

export default toggleBookmark;
