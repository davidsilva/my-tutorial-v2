import { useEffect, useState, useCallback } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { AsyncProcess, AsyncProcessStatus } from "../types";

interface AdminCheckResult {
  isAdmin: boolean;
}

interface AdminCheckError {
  message: string;
}

const useIsAdmin = () => {
  const [adminCheck, setAdminCheck] = useState<
    AsyncProcess<AdminCheckResult, AdminCheckError>
  >({
    status: AsyncProcessStatus.NONE,
  });

  const checkIsAdmin = useCallback(async () => {
    console.log("Checking if user is an admin. Setting to PENDING");
    setAdminCheck({ status: AsyncProcessStatus.PENDING });
    try {
      const session = await fetchAuthSession();
      const tokens = session.tokens;

      let isAdmin = false;

      if (tokens && Object.keys(tokens).length > 0) {
        const groups = tokens.accessToken.payload["cognito:groups"];
        isAdmin = Array.isArray(groups) && groups.includes("adminUsers");
      }

      setAdminCheck({
        status: AsyncProcessStatus.SUCCESS,
        value: { isAdmin },
      });

      console.log(`User is ${isAdmin ? "" : "not "}an admin`);
    } catch (error) {
      console.error(
        `Error checking admin status or user cannot be an admin because not signed in: ${error}`
      );
      setAdminCheck({
        status: AsyncProcessStatus.SUCCESS,
        value: {
          isAdmin: false,
        },
      });
    }
  }, []);

  useEffect(() => {
    checkIsAdmin();
  }, [checkIsAdmin]);

  return { adminCheck, checkIsAdmin };
};

export default useIsAdmin;
