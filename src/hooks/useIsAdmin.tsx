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
      if (tokens && Object.keys(tokens).length > 0) {
        const groups = tokens.accessToken.payload["cognito:groups"];
        if (groups && Array.isArray(groups) && groups.includes("adminUsers")) {
          console.log("User is an admin");
          setAdminCheck({
            status: AsyncProcessStatus.SUCCESS,
            value: { isAdmin: true },
          });
        } else {
          console.log("User is not an admin");
          setAdminCheck({
            status: AsyncProcessStatus.SUCCESS,
            value: { isAdmin: false },
          });
        }
      } else {
        console.log("User is not an admin");
        setAdminCheck({
          status: AsyncProcessStatus.SUCCESS,
          value: { isAdmin: false },
        });
      }
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
