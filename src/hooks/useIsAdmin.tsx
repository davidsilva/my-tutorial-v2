import { useEffect, useState, useCallback } from "react";
import { AuthError, fetchAuthSession } from "aws-amplify/auth";

const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkIsAdmin = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await fetchAuthSession();
      const tokens = session.tokens;
      if (tokens && Object.keys(tokens).length > 0) {
        const groups = tokens.accessToken.payload["cognito:groups"];
        if (groups && Array.isArray(groups) && groups.includes("adminUsers")) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error(`Error checking admin status: ${authError.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkIsAdmin();
  }, [checkIsAdmin]);

  return { isAdmin, checkIsAdmin, isLoading };
};

export default useIsAdmin;
