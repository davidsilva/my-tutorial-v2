import { useState, useEffect, useCallback } from "react";
import { AuthUser, getCurrentUser } from "aws-amplify/auth";

const useCheckForUser = () => {
  const initialIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setIsLoggedIn(true);
      setUser(currentUser);
    } catch (err) {
      console.error(err);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return { isLoggedIn, user, checkUser, isLoading };
};

export default useCheckForUser;
