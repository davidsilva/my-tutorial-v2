import { useEffect, useState, useCallback } from "react";
import { AuthError, fetchAuthSession } from "aws-amplify/auth";

const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckRun, setIsCheckRun] = useState(false);

  const checkIsAdmin = useCallback(async () => {
    setIsLoading(true);
    let myIsAdmin = false;
    try {
      const session = await fetchAuthSession();
      const tokens = session.tokens;
      if (tokens && Object.keys(tokens).length > 0) {
        const groups = tokens.accessToken.payload["cognito:groups"];
        if (groups && Array.isArray(groups) && groups.includes("adminUsers")) {
          console.log("User is an admin");
          myIsAdmin = true;
        } else {
          console.log("User is not an admin");
        }
      }
    } catch (error) {
      if (error instanceof AuthError) {
        console.error(`Error checking admin status: ${error.message}`);
      } else {
        console.error("Not an AuthError", error);
      }
    } finally {
      setIsLoading(false);
      setIsCheckRun(true);
      setIsAdmin(myIsAdmin);
    }
  }, []);

  const reset = useCallback(() => {
    setIsAdmin(false);
    setIsCheckRun(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkIsAdmin();
  }, [checkIsAdmin]);

  return { isAdmin, checkIsAdmin, isLoading, isCheckRun, setIsCheckRun, reset };
};

export default useIsAdmin;
