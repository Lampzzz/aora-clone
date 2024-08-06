import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";

import { auth, getAllBookmarkPosts, getUserData } from "../services/firebase";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [laoding, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bookmarkPosts, setBookmarkPosts] = useState([]);

  const fetchBookmarks = async (userid) => {
    const bookmarks = await getAllBookmarkPosts(userid);
    setBookmarkPosts(bookmarks);
  };

  const fetchUser = async (userid) => {
    const data = await getUserData(userid);
    setUser({ userid, ...data });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        fetchBookmarks(userAuth.userId);
        fetchUser(userAuth.userId);
        setIsLogged(true);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        laoding,
        user,
        bookmarkPosts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
