import { useState, useCallback } from "react";
import { UpdateSessionInput, Session } from "../API";
import { post, get, patch } from "aws-amplify/api";
import useLocalStorage from "./useLocalStorage";
import { AuthUser } from "aws-amplify/auth";
import { AsyncProcess, AsyncProcessStatus } from "../types";

type SessionType = Session | null;

interface SessionCheckResult {
  session: SessionType;
}

interface SessionCheckError {
  message: string;
}

const useSession = () => {
  const [localStorageSessionId, setLocalStorageSessionId] =
    useLocalStorage("sessionId");
  const [sessionCheck, setSessionCheck] = useState<
    AsyncProcess<SessionCheckResult, SessionCheckError>
  >({
    status: AsyncProcessStatus.NONE,
  });

  const getSession = useCallback(
    async (user: AuthUser | null) => {
      setSessionCheck({ status: AsyncProcessStatus.PENDING });

      let sessionId = localStorageSessionId;
      let sessionData: SessionType = null;

      if (sessionId) {
        const result = await get({
          apiName: "SessionAPI",
          path: `/session/${sessionId}`,
        });
        const { body } = await result.response;
        sessionData = (await body.json()) as SessionType;
      }

      if (user?.userId && sessionData && sessionData.userId !== user?.userId) {
        try {
          const response = await patch({
            apiName: "SessionAPI",
            path: `/session/${sessionId}`,
            options: {
              body: {
                id: sessionId,
                userId: user.userId,
                user: user,
              } as Partial<SessionType>,
            },
          }).response;
          // The response only contains properties that are updated, e.g., userId and updatedAt.
          const updates = (await response.body.json()) as Partial<SessionType>;
          sessionData = { ...sessionData, ...updates };
        } catch (error) {
          console.error("Error updating session with user", error);
        }
      }

      if (!sessionData || !sessionId) {
        const path = user?.userId
          ? `/session?userId=${encodeURIComponent(user.userId)}`
          : "/session";
        const response = await post({
          apiName: "SessionAPI",
          path: path,
        }).response;
        sessionData = (await response.body.json()) as SessionType;
        sessionId = sessionData ? sessionData.id : null;
        setLocalStorageSessionId(sessionId);
      }
      console.log("should set session status to success");
      setSessionCheck({
        status: AsyncProcessStatus.SUCCESS,
        value: { session: sessionData },
      });
    },
    [localStorageSessionId, setLocalStorageSessionId]
  );

  const deleteSession = useCallback(
    async (id: string) => {
      try {
        const sessionData: UpdateSessionInput = {
          id,
          deletedAt: new Date().toISOString(),
        };
        const response = await patch({
          apiName: "SessionAPI",
          path: `/session/${id}`,
          options: {
            body: sessionData,
          },
        }).response;
        console.log("Session deleted", await response.body.json());
      } catch (error) {
        console.error("Error deleting session", error);
      } finally {
        setLocalStorageSessionId(null);
        setSessionCheck({ status: AsyncProcessStatus.NONE });
      }
    },
    [setLocalStorageSessionId]
  );

  const reset = useCallback(() => {
    setSessionCheck({ status: AsyncProcessStatus.NONE });
  }, []);

  return {
    sessionCheck,
    getSession,
    deleteSession,
    reset,
  };
};

export default useSession;
