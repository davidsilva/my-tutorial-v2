import { useState, useEffect } from "react";
import type { User, GetUserQuery } from "../API";
import { generateClient, GraphQLResult } from "aws-amplify/api";
import { getUser } from "../graphql/queries";
import { useAuthContext } from "../context/AuthContext";
import { GraphQLError } from "graphql";

const client = generateClient();

const useGetUser = (userId: string | undefined) => {
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { authState } = useAuthContext();
  const isLoggedIn = authState?.isLoggedIn;
  const isAuthStateKnown = authState?.isAuthStateKnown;

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        console.error("no user id provided");
        setErrorMessage("No user ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = (await client.graphql({
          query: getUser,
          variables: { id: userId },
          authMode: isLoggedIn ? "userPool" : "iam",
        })) as GraphQLResult<GetUserQuery>;

        const userData = result.data?.getUser as User;
        if (!userData || result.errors) {
          setErrorMessage("Could not get user with ID: " + userId);
          return;
        }
        setUser(userData);
      } catch (err) {
        const graphQLError = err as GraphQLError;
        console.error("error fetching user: ", graphQLError.message);
        setErrorMessage(
          `Error fetching user with ID ${userId}: ${graphQLError.message}`
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (isAuthStateKnown) fetchUser();
  }, [userId, isLoggedIn, isAuthStateKnown]);

  return { user, errorMessage, isLoading };
};
export default useGetUser;
