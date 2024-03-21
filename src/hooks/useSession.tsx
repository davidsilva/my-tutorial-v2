import { useState, useEffect, useCallback } from "react";
import { generateClient } from "aws-amplify/api";
import { updateSession as awsUpdateSession } from "../graphql/mutations";
import { UpdateSessionInput, Session } from "../API";
import useCheckForUser from "../hooks/useCheckForUser";
import { post, get, patch } from "aws-amplify/api";

type SessionType = Session | null;

const useSession = () => {
  const [localStorageSessionId, setLocalStorageSessionId] = useState(() => {
    return localStorage.getItem("sessionId");
  });
  const [session, setSession] = useState<SessionType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, isLoading: isUserCheckLoading, user } = useCheckForUser();

  const getSession = useCallback(async () => {
    setIsLoading(true);
    let sessionId = localStorageSessionId;
    let sessionData: SessionType = null;

    if (sessionId) {
      const response = await get({
        apiName: "SessionAPI",
        path: `/session/${sessionId}`,
      }).response;
      sessionData = (await response.body.json()) as SessionType;
      console.log("sessionId", sessionId, "sessionData", sessionData);
    }

    if (!sessionData) {
      const response = await post({
        apiName: "SessionAPI",
        path: "/session",
      }).response;
      sessionData = (await response.body.json()) as SessionType;
      sessionId = sessionData ? sessionData.id : null;
      setLocalStorageSessionId(sessionId);
    }

    if (isLoggedIn && user && user.userId) {
      const response = await patch({
        apiName: "SessionAPI",
        path: `/session/${sessionId}`,
        options: { body: { userId: user.userId, id: sessionId } },
      }).response;
      sessionData = (await response.body.json()) as SessionType;
      console.log(
        "isLoggedIn",
        isLoggedIn,
        "user",
        user,
        "sessionData",
        sessionData
      );
    }

    setSession(sessionData);
    setIsLoading(false);
  }, [localStorageSessionId, isLoggedIn, setLocalStorageSessionId]);

  useEffect(() => {
    if (!isUserCheckLoading) {
      getSession();
    }
  }, [getSession, isUserCheckLoading]);

  const createSession = async (userId?: string) => {
    let sessionId = null;
    try {
      const path =
        "/session" + (userId ? `userId=${encodeURIComponent(userId)}` : "");

      const response = await post({
        apiName: "SessionAPI",
        path: path,
      }).response;

      console.log("response", response); // object

      const session = (await response.body.json()) as SessionType; // response.body is readable stream
      // result is object with body as a string that needs to be parsed into json

      // const bodyJson = JSON.parse(result?.body);

      console.log("createSession", session);

      setSession(session);
      sessionId = session ? session.id : null;
      setLocalStorageSessionId(sessionId);
    } catch (error) {
      console.error("Error creating session", error);
    }
    return sessionId;
  };

  const updateSession = async (id: string, sessionData: UpdateSessionInput) => {
    try {
      // const client = generateClient();
      // await client.graphql({
      //   query: awsUpdateSession,
      //   variables: {
      //     input: {
      //       ...sessionData,
      //       id,
      //     },
      //   },
      // });
      const response = await patch({
        apiName: "SessionAPI",
        path: `/session/${id}`,
        options: {
          body: sessionData,
        },
      }).response;

      const session = (await response.body.json()) as SessionType;
      setSession(session);
    } catch (error) {
      console.error("Error updating session", error);
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const sessionData: UpdateSessionInput = {
        id,
        deletedAt: new Date().toISOString(),
      };
      await updateSession(id, sessionData);
      setLocalStorageSessionId("");
    } catch (error) {
      console.error("Error deleting session", error);
    }
  };

  return {
    session,
    createSession,
    updateSession,
    deleteSession,
    isLoading,
    getSession,
  };
};

export default useSession;
