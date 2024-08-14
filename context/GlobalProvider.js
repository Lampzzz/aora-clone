import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { onAuthStateChanged } from "@firebase/auth";

import {
  auth,
  getAllBookmarkPosts,
  getAllUserPosts,
  getUserData,
} from "../services/firebase";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bookmarkPosts, setBookmarkPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  const fetchBookmarks = async (userid) => {
    const bookmarks = await getAllBookmarkPosts(userid);
    setBookmarkPosts(bookmarks);
  };

  const fetchUser = async (userid) => {
    const data = await getUserData(userid);
    setUser({ userid, ...data });
  };

  const fetchUserPosts = useMemo(async (uid) => {
    const data = await getAllUserPosts(uid);
    setUserPosts(data);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        fetchUserPosts(userAuth.uid);
        fetchBookmarks(userAuth.uid);
        fetchUser(userAuth.uid);
        setIsLogged(true);
      } else {
        setIsLogged(false);
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        loading,
        user,
        bookmarkPosts,
        userPosts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
