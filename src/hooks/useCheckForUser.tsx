import { useState, useEffect, useCallback } from "react";
import { AuthUser, getCurrentUser, AuthError } from "aws-amplify/auth";

const useCheckForUser = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckRun, setIsCheckRun] = useState(false);

  const checkUser = useCallback(async () => {
    setIsLoading(true);
    setIsCheckRun(true);
    let currentUser: AuthUser | null = null;
    try {
      currentUser = await getCurrentUser();
    } catch (err) {
      if (err instanceof AuthError) {
        console.error(`Error checking for user: ${err.message}`);
      } else {
        console.error("Not an AuthError", err);
      }
      currentUser = null;
    } finally {
      setIsLoading(false);
      setUser(currentUser);
    }
  }, []);

  const reset = useCallback(() => {
    setUser(null);
    setIsCheckRun(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return { user, checkUser, isLoading, isCheckRun, reset };
};

export default useCheckForUser;
