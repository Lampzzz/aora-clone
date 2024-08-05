import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";

import { auth, getAllBookmarkPosts } from "../services/firebase";
import fetchUserCredentials from "../api/fetchUserCredentials";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [laoding, setLoading] = useState(true);
  const [userCredentials, setUserCredentials] = useState(null);
  const [bookmarkPosts, setBookmarkPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        setIsLogged(true);

        const data = await fetchUserCredentials(userAuth.uid);
        setUserCredentials(data);

        const bookmarks = await getAllBookmarkPosts(userAuth.uid);
        setBookmarkPosts(bookmarks);
      } else {
        setUser(null);
        setIsLogged(false);
        setUserCredentials(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        isLogged,
        setIsLogged,
        laoding,
        userCredentials,
        bookmarkPosts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
