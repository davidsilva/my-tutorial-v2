import { renderHook, waitFor } from "@testing-library/react";
import { AuthContextProvider } from "../context/AuthContext";
import useGetUser from "./useGetUser";
import { ReactNode } from "react";
import { GraphQLError } from "graphql";
import { User } from "../API";

vi.mock("aws-amplify/auth");

const { graphqlMock } = vi.hoisted(() => {
  return { graphqlMock: vi.fn() };
});

vi.mock("aws-amplify/api", () => ({
  generateClient: vi.fn(() => ({
    graphql: graphqlMock,
  })),
}));

const { mockUser } = vi.hoisted(() => {
  return {
    mockUser: {
      __typename: "User",
      id: "userId123",
      username: "testuser",
      userId: "userId123",
      createdAt: "2021-09-01T00:00:00.000Z",
      updatedAt: "2021-09-01T00:00:00.000Z",
    } as User,
  };
});

vi.mock("../context/AuthContext", async () => ({
  AuthContextProvider: ({ children }: { children: ReactNode }) => children,
  useAuthContext: () => ({
    authState: {
      isAuthStateKnown: true,
      isLoggedIn: true,
      user: { username: "testuser", userId: "userId123" },
      isAdmin: false,
    },
  }),
}));

describe("useGetUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(graphqlMock).mockImplementation(({ variables }) => {
      if (variables.id === "bbc98375-b793-4aee-a59a-7872975cd905") {
        return Promise.resolve({
          data: { getUser: mockUser },
        });
      }

      return Promise.reject(new GraphQLError("User not found"));
    });
  });

  test("should return user for given userId", async () => {
    const wrapper = ({ children }: { children?: ReactNode }) => (
      <AuthContextProvider>{children}</AuthContextProvider>
    );

    const { result } = renderHook(
      () => useGetUser("bbc98375-b793-4aee-a59a-7872975cd905"),
      {
        wrapper,
      }
    );

    await waitFor(() => result.current.user !== null);

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.errorMessage).toBe("");
    expect(result.current.isLoading).toBe(false);
  });

  test("should return null user and error message for invalid userId", async () => {
    const wrapper = ({ children }: { children?: ReactNode }) => (
      <AuthContextProvider>{children}</AuthContextProvider>
    );

    const { result } = renderHook(
      () => useGetUser("bbc98375-b793-4aee-a59a-7872975cd90"),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.user).toBe(null);
      expect(result.current.errorMessage).toBe(
        "Error fetching user with ID bbc98375-b793-4aee-a59a-7872975cd90: User not found"
      );
      expect(result.current.isLoading).toBe(false);
    });
  });
});
