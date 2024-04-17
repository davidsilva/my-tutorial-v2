import { useState, useEffect, useCallback } from "react";
import { AuthUser, getCurrentUser, AuthError } from "aws-amplify/auth";
import { AsyncProcess, AsyncProcessStatus } from "../types";

interface UserCheckResult {
  user: AuthUser | null;
}

interface UserCheckError {
  message: string;
}

const useCheckForUser = () => {
  const [userCheck, setUserCheck] = useState<
    AsyncProcess<UserCheckResult, UserCheckError>
  >({
    status: AsyncProcessStatus.NONE,
  });

  const checkUser = useCallback(async () => {
    setUserCheck({ status: AsyncProcessStatus.PENDING });

    try {
      const currentUser = await getCurrentUser();
      // console.log("User is signed in", currentUser);
      setUserCheck({
        status: AsyncProcessStatus.SUCCESS,
        value: { user: currentUser },
      });
    } catch (err) {
      if (err instanceof AuthError) {
        console.error(`Error checking for user: ${err.message}`);
      } else {
        console.error("Not an AuthError", err);
      }
      setUserCheck({
        status: AsyncProcessStatus.SUCCESS,
        value: { user: null },
      });
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return { userCheck, checkUser };
};

export default useCheckForUser;
