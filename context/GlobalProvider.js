import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@/firebase/config";
import { getUserData } from "@/firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUserData = useCallback(
    async (uid) => {
      try {
        const userData = await getUserData(uid);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setCurrentUser(null);
      }
    },
    [currentUser]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        await fetchUserData(userAuth.uid);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        currentUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
