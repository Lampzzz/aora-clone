import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import fetchUserCredentials from "../api/fetchUserCredentials";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [laoding, setLoading] = useState(true);
  const [userCredentials, setUserCredentials] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        setIsLogged(true);

        const data = await fetchUserCredentials(userAuth.uid);

        setUserCredentials(data);
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
      value={{ user, setUser, isLogged, setIsLogged, laoding, userCredentials }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
