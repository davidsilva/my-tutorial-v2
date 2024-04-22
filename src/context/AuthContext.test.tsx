import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthContextProvider, useAuthContext } from "./AuthContext";
import userEvent from "@testing-library/user-event";
import * as awsAmplifyAuth from "aws-amplify/auth";
import { toast } from "react-toastify";
import { AuthError } from "aws-amplify/auth";
import { User } from "../API";
import { SessionType } from "../types";

vi.mock("aws-amplify/auth");

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

const { mockSessionWithoutUser } = vi.hoisted(() => {
  return {
    mockSessionWithoutUser: {
      __typename: "Session",
      id: "sessionId123",
      userId: null,
      user: null,
      createdAt: "2021-09-01T00:00:00.000Z",
      updatedAt: "2021-09-01T00:00:00.000Z",
    } as SessionType,
  };
});

const { mockSessionWithUser } = vi.hoisted(() => {
  return {
    mockSessionWithUser: {
      __typename: "Session",
      id: "sessionId456",
      userId: mockUser.userId,
      user: mockUser,
      createdAt: "2021-09-01T00:00:00.000Z",
      updatedAt: "2021-09-01T00:00:00.000Z",
    } as SessionType,
  };
});

vi.mock("aws-amplify/api", async () => {
  const awsAmplifyApi = await vi.importActual<typeof import("aws-amplify/api")>(
    "aws-amplify/api"
  );
  return {
    ...awsAmplifyApi,
    post: vi.fn().mockImplementation(({ path }) => {
      if (path === `/session?userId=${encodeURIComponent(mockUser.userId)}`) {
        const mockSessionWithUserId = {
          ...mockSessionWithoutUser,
          user: mockUser,
          userId: mockUser.userId,
        };
        return {
          response: Promise.resolve({
            body: {
              json: vi.fn().mockResolvedValue(mockSessionWithUserId),
            },
          }),
        };
      } else {
        return {
          response: Promise.resolve({
            body: {
              json: vi.fn().mockResolvedValue(mockSessionWithoutUser),
            },
          }),
        };
      }
    }),
    get: vi.fn().mockImplementation(({ path }) => {
      if (path === `/session/${mockSessionWithoutUser?.id}`) {
        return {
          response: Promise.resolve({
            body: {
              json: vi.fn().mockResolvedValue(mockSessionWithoutUser),
            },
          }),
        };
      } else if (path === `/session/${mockSessionWithUser?.id}`) {
        return {
          response: Promise.resolve({
            body: {
              json: vi.fn().mockResolvedValue(mockSessionWithUser),
            },
          }),
        };
      } else {
        return {
          response: Promise.resolve({
            body: {
              json: vi.fn().mockResolvedValue(null),
            },
          }),
        };
      }
    }),
    patch: vi.fn().mockImplementation(({ options }) => {
      const updates = options.body;
      return {
        response: Promise.resolve({
          body: {
            json: vi.fn().mockResolvedValue(updates),
          },
        }),
      };
    }),
  };
});

const { mockNavigate } = vi.hoisted(() => {
  return { mockNavigate: vi.fn() };
});

vi.mock("react-router-dom", async () => {
  const router = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...router,
    useNavigate: vi.fn().mockReturnValue(mockNavigate),
  };
});

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

const TestComponent: React.FC = () => {
  const {
    signInStep,
    setSignInStep,
    signIn,
    signOut,
    signUp,
    confirmSignUp,
    confirmSignIn,
    resetAuthState,
    intendedPath,
    authState,
  } = useAuthContext();

  if (!authState?.isAuthStateKnown) {
    return (
      <div data-testid="isAuthStateKnown">
        isAuthStateKnown: {authState?.isAuthStateKnown ? "true" : "false"}
      </div>
    );
  }

  return (
    <>
      <div data-testid="isAuthStateKnown">
        isAuthStateKnown: {authState?.isAuthStateKnown ? "true" : "false"}
      </div>
      <div data-testid="isLoggedIn">
        isLoggedIn: {authState?.isLoggedIn ? "true" : "false"}
      </div>
      <div data-testid="signInStep">signInStep: {signInStep}</div>
      <div data-testid="isAdmin">
        isAdmin: {authState?.isAdmin ? "true" : "false"}
      </div>
      <div data-testid="user">username: {authState?.user?.username}</div>
      <div data-testid="sessionId">sessionId: {authState?.sessionId}</div>
      <div data-testid="intendedPath">
        intendedPath: {intendedPath || "undefined"}
      </div>
      <div>
        <button
          onClick={() =>
            signIn(
              { username: "testuser", password: "testpassword" },
              mockNavigate
            )
          }
        >
          Sign In
        </button>
        <button onClick={() => signOut(mockNavigate)}>Sign Out</button>
        <button
          onClick={() =>
            signUp(
              {
                username: "testuser",
                password: "testpassword",
                email: "testuser@test.com",
              },
              mockNavigate
            )
          }
        >
          Sign Up
        </button>
        <button
          onClick={() =>
            confirmSignUp(
              { username: "testuser", confirmationCode: "123456" },
              mockNavigate
            )
          }
        >
          Confirm Sign Up
        </button>
        <button
          onClick={() =>
            confirmSignIn({ challengeResponse: "xyz" }, mockNavigate)
          }
        >
          Confirm Sign In
        </button>
        <button onClick={() => setSignInStep("this step")}>
          setSignInStep
        </button>
        <button onClick={() => resetAuthState()}>resetAuthState</button>
      </div>
    </>
  );
};
describe("AuthContext", () => {
  describe("sign in (regular user)", () => {
    let originalLocalStorage: Storage;
    beforeEach(async () => {
      originalLocalStorage = window.localStorage;

      /* 
      I wasn't able to mock useSession, which is used by AuthContext, and useLocalStorage, which is used by useSession, in a way that would make the useEffects in AuthContext detect changes to the sessionCheck state variable as it progresses from NONE to PENDING to SUCCESS. So, here, I'm creating a mock version of localStorage and assigning it to window.localStorage before each test. This allows the tests to interact with this mock localStorage as if it were the real localStorage. After each test, I'm restoring the original localStorage to ensure that any changes made by the test don't persist and affect other tests.

      Even if Vitest runs tests in parallel, either in separate threads or processes, there should be no interference among tests. This is because each test file runs in its own environment with its own global window object. So, when we replace window.localStorage with a mock in one test file, it doesn't affect window.localStorage in any other test files. This isolation ensures that tests do not interfere with each other, making them more reliable and predictable.
      */
      window.localStorage = {
        _storage: {},
        setItem: function (key: string, val: string) {
          return (this._storage[key] = String(val));
        },
        getItem: function (key: string) {
          return this._storage[key] || null;
        },
        removeItem: function (key: string) {
          return delete this._storage[key];
        },
        clear: function () {
          this._storage = {};
        },
        get length() {
          return Object.keys(this._storage).length;
        },
        key: function (i: number) {
          const keys = Object.keys(this._storage);
          return keys[i] || null;
        },
      };

      vi.clearAllMocks();

      // mock for when user is not an admin
      vi.mocked(awsAmplifyAuth.fetchAuthSession).mockResolvedValue({
        tokens: {
          accessToken: {
            payload: {
              "cognito:groups": [],
            },
          },
        },
      });
    });

    afterEach(() => {
      window.localStorage = originalLocalStorage;

      vi.mocked(awsAmplifyAuth.signIn).mockReset();
      vi.mocked(awsAmplifyAuth.getCurrentUser).mockReset();
    });

    test("should call AWS signIn with correct values for the case where confirmation (password change) is not required (and user is not admin)", async () => {
      const user = userEvent.setup();

      const mockGetCurrentUser = vi.mocked(awsAmplifyAuth.getCurrentUser);

      /* 
      A session for the anonymous user already exists; it should be updated with the signed-in user's data (via PATCH). A test in useSession.test.tsx covers the scenario where there's no pre-existing session.
      */
      const sessionId = mockSessionWithoutUser?.id || "";
      window.localStorage.setItem("sessionId", sessionId);

      // mock for when sign-in confirmation is not required
      vi.mocked(awsAmplifyAuth.signIn).mockResolvedValueOnce({
        nextStep: {
          signInStep: "DONE",
        },
        isSignedIn: true,
      });

      /*
      Used by useCheckForUser hook. User is initially not signed in.
      */
      mockGetCurrentUser.mockRejectedValue(new Error("No user signed in"));

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      await waitFor(() => {
        // we want to wait for authState.isAuthStateKnown to be true
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
        expect(screen.getByTestId("isLoggedIn")).toHaveTextContent(
          "isLoggedIn: false"
        );
        expect(screen.getByTestId("isAdmin")).toHaveTextContent(
          "isAdmin: false"
        );
        expect(screen.getByTestId("sessionId")).toHaveTextContent(sessionId);
      });

      // the user is known after signing in
      mockGetCurrentUser.mockResolvedValue(mockUser);

      const signInButton = screen.getByRole("button", { name: "Sign In" });

      expect(signInButton).toBeInTheDocument();

      await user.click(signInButton);

      await waitFor(() => {
        expect(awsAmplifyAuth.signIn).toHaveBeenCalledWith({
          username: "testuser",
          password: "testpassword",
        });
      });

      await waitFor(() => {
        expect(screen.getByTestId("isLoggedIn")).toHaveTextContent(
          "isLoggedIn: true"
        );
      });
    });

    test("should call toast with error message if AWS signIn throws an error", async () => {
      const user = userEvent.setup();

      vi.mocked(awsAmplifyAuth.signIn).mockRejectedValueOnce({
        message: "Incorrect username or password.",
      });

      // start out with anonymous user
      vi.mocked(awsAmplifyAuth.getCurrentUser).mockRejectedValue(undefined);

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      await waitFor(() => {
        // we want to wait for authState.isAuthStateKnown to be true
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
        expect(screen.getByTestId("isLoggedIn")).toHaveTextContent(
          "isLoggedIn: false"
        );
        expect(screen.getByTestId("isAdmin")).toHaveTextContent(
          "isAdmin: false"
        );
      });

      const signInButton = screen.getByRole("button", { name: "Sign In" });

      expect(signInButton).toBeInTheDocument();

      await user.click(signInButton);

      expect(awsAmplifyAuth.signIn).toHaveBeenCalledWith({
        username: "testuser",
        password: "testpassword",
      });

      expect(toast.error).toHaveBeenCalledWith(
        expect.stringMatching(/^There was a problem signing you in:/)
      );
    });

    test("should navigate to /confirmsignin when signIn returns signInStep as CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED", async () => {
      const user = userEvent.setup();

      vi.mocked(awsAmplifyAuth.signIn).mockResolvedValueOnce({
        nextStep: {
          signInStep: "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED",
        },
        isSignedIn: false,
      });

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      await waitFor(() => {
        // we want to wait for authState.isAuthStateKnown to be true
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
        expect(screen.getByTestId("isLoggedIn")).toHaveTextContent(
          "isLoggedIn: false"
        );
        expect(screen.getByTestId("isAdmin")).toHaveTextContent(
          "isAdmin: false"
        );
      });

      const signInButton = screen.getByRole("button", { name: "Sign In" });
      expect(signInButton).toBeInTheDocument();

      await user.click(signInButton);

      await waitFor(() => {
        // we want to wait for authState.isAuthStateKnown to be true
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
        expect(screen.getByTestId("isLoggedIn")).toHaveTextContent(
          "isLoggedIn: false"
        );
        expect(screen.getByTestId("isAdmin")).toHaveTextContent(
          "isAdmin: false"
        );
      });

      expect(toast.success).toHaveBeenCalledWith("Please set a new password.");

      expect(mockNavigate).toHaveBeenCalledWith("/signinconfirm");
    });
  });

  describe("confirm sign in", () => {
    beforeEach(async () => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.mocked(awsAmplifyAuth.confirmSignIn).mockReset();
      vi.mocked(awsAmplifyAuth.getCurrentUser).mockReset();
    });

    test("should call AWS confirmSignIn with correct values and then call navigate with /", async () => {
      const user = userEvent.setup();

      vi.mocked(awsAmplifyAuth.confirmSignIn).mockResolvedValueOnce({
        isSignedIn: true,
        nextStep: {
          signInStep: "DONE",
        },
      });

      vi.mocked(awsAmplifyAuth.getCurrentUser).mockRejectedValue(undefined);

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
        expect(screen.getByTestId("isLoggedIn")).toHaveTextContent(
          "isLoggedIn: false"
        );
      });

      vi.mocked(awsAmplifyAuth.getCurrentUser).mockResolvedValue(mockUser);

      const confirmSignInButton = screen.getByRole("button", {
        name: "Confirm Sign In",
      });

      expect(confirmSignInButton).toBeInTheDocument();

      await user.click(confirmSignInButton);

      await waitFor(() => {
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
        expect(screen.getByTestId("isLoggedIn")).toHaveTextContent(
          "isLoggedIn: true"
        );
      });

      expect(awsAmplifyAuth.confirmSignIn).toHaveBeenCalledWith({
        challengeResponse: "xyz",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Sign in confirmed successfully!"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("sign up", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      /*         
        Signing up doesn't sign a user in. User can't sign up if signed in.
        */
      vi.mocked(awsAmplifyAuth.getCurrentUser).mockRejectedValue(undefined);

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      // Eliminates warning about not waiting for state to be updated.
      // Only if render() is called in beforeEach.
      await waitFor(() => {});
    });

    afterEach(() => {
      vi.mocked(awsAmplifyAuth.getCurrentUser).mockReset();
      vi.mocked(awsAmplifyAuth.signUp).mockReset();
    });

    test("should call AWS signUp with correct values and then call navigate with /signupconfirm/${username}", async () => {
      const user = userEvent.setup();

      vi.mocked(awsAmplifyAuth.signUp).mockResolvedValueOnce({
        nextStep: {
          signUpStep: "CONFIRM_SIGN_UP",
          codeDeliveryDetails: {
            attributeName: "email",
            deliveryMedium: "EMAIL",
            destination: "testuser@test.com",
          },
        },
        isSignUpComplete: false,
      });

      await waitFor(() => {
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
        expect(screen.getByTestId("isLoggedIn")).toHaveTextContent(
          "isLoggedIn: false"
        );
      });

      const signUpButton = screen.getByRole("button", { name: "Sign Up" });

      expect(signUpButton).toBeInTheDocument();

      await user.click(signUpButton);

      await waitFor(() => {
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
        expect(screen.getByTestId("isLoggedIn")).toHaveTextContent(
          "isLoggedIn: false"
        );
      });

      expect(awsAmplifyAuth.signUp).toHaveBeenCalledWith({
        username: "testuser",
        password: "testpassword",
        options: {
          userAttributes: {
            email: "testuser@test.com",
          },
          autoSignIn: false,
        },
      });
    });

    test("should call toast with error message if AWS signUp throws an error", async () => {
      const user = userEvent.setup();

      const authError = new AuthError({
        name: "some error",
        message: "some unknown error.",
      });

      vi.mocked(awsAmplifyAuth.signUp).mockRejectedValueOnce(authError);

      await waitFor(() => {
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
      });

      const signUpButton = screen.getByRole("button", { name: "Sign Up" });

      expect(signUpButton).toBeInTheDocument();

      await user.click(signUpButton);

      expect(awsAmplifyAuth.signUp).toHaveBeenCalledWith({
        username: "testuser",
        password: "testpassword",
        options: {
          userAttributes: {
            email: "testuser@test.com",
          },
          autoSignIn: false,
        },
      });

      expect(toast.error).toHaveBeenCalledWith(
        expect.stringMatching(/^There was a problem signing you up:/)
      );
    });
  });

  describe("sign up confirmation", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );
      await waitFor(() => {
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
      });
    });

    afterEach(() => {
      vi.mocked(awsAmplifyAuth.confirmSignUp).mockReset();
      vi.mocked(awsAmplifyAuth.getCurrentUser).mockReset();
    });

    test("should call AWS confirmSignUp with correct values and then call navigate with /signin", async () => {
      const user = userEvent.setup();

      vi.mocked(awsAmplifyAuth.confirmSignUp).mockResolvedValueOnce({
        isSignUpComplete: true,
        nextStep: {
          signUpStep: "DONE",
        },
      });

      const confirmSignUpButton = screen.getByRole("button", {
        name: "Confirm Sign Up",
      });

      expect(confirmSignUpButton).toBeInTheDocument();

      await user.click(confirmSignUpButton);

      expect(awsAmplifyAuth.confirmSignUp).toHaveBeenCalledWith({
        username: "testuser",
        confirmationCode: "123456",
      });
      expect(toast.success).toHaveBeenCalledWith("Sign up complete!");
      expect(mockNavigate).toHaveBeenCalledWith("/signin");
    });

    test("should call toast with error message if AWS confirmSignUp throws an error", async () => {
      const user = userEvent.setup();

      const authError = new AuthError({
        name: "some error",
        message: "some unknown error.",
      });

      vi.mocked(awsAmplifyAuth.confirmSignUp).mockRejectedValueOnce(authError);

      const confirmSignUpButton = screen.getByRole("button", {
        name: "Confirm Sign Up",
      });
      await user.click(confirmSignUpButton);

      expect(awsAmplifyAuth.confirmSignUp).toHaveBeenCalledWith({
        username: "testuser",
        confirmationCode: "123456",
      });

      expect(toast.error).toHaveBeenCalledWith(
        expect.stringMatching(/^There was a problem confirming your sign up/i)
      );
    });
  });

  describe("sign out", () => {
    /*
      Signing out should clear the current sessionId from local storage, reset the auth state, and navigate to the home page. The session should also be soft-deleted by giving it a deletedAt timestamp.

      A *new* sessionId should then be created, with the assumption that we always want to associate shopping cart contents with a user and a session.

      Of course the current authState would also be reset on sign out. And cart contents would be cleared out for the now-anonymous user.
      */

    let originalLocalStorage: Storage;

    beforeEach(async () => {
      vi.clearAllMocks();

      originalLocalStorage = window.localStorage;

      window.localStorage = {
        _storage: {},
        setItem: function (key: string, val: string) {
          return (this._storage[key] = String(val));
        },
        getItem: function (key: string) {
          return this._storage[key] || null;
        },
        removeItem: function (key: string) {
          return delete this._storage[key];
        },
        clear: function () {
          this._storage = {};
        },
        get length() {
          return Object.keys(this._storage).length;
        },
        key: function (i: number) {
          const keys = Object.keys(this._storage);
          return keys[i] || null;
        },
      };

      vi.mocked(awsAmplifyAuth.signOut).mockResolvedValueOnce(undefined);
    });

    afterEach(() => {
      window.localStorage = originalLocalStorage;

      vi.mocked(awsAmplifyAuth.getCurrentUser).mockReset();
      vi.mocked(awsAmplifyAuth.signOut).mockReset();
    });

    test("should call AWS signOut with correct values and then call navigate with /", async () => {
      const sessionId = mockSessionWithUser?.id || "";
      window.localStorage.setItem("sessionId", sessionId);

      const user = userEvent.setup();

      vi.mocked(awsAmplifyAuth.getCurrentUser).mockResolvedValue({
        username: "testuser",
        userId: "123456",
      });

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
        expect(screen.getByTestId("sessionId")).toHaveTextContent(sessionId);
        expect(screen.getByTestId("isLoggedIn")).toHaveTextContent(
          "isLoggedIn: true"
        );
      });

      const signOutButton = screen.getByRole("button", { name: "Sign Out" });

      expect(signOutButton).toBeInTheDocument();

      // Simulate anonymous user
      vi.mocked(awsAmplifyAuth.getCurrentUser).mockRejectedValue(undefined);

      await user.click(signOutButton);

      await waitFor(() => {
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
        expect(screen.getByTestId("isLoggedIn")).toHaveTextContent(
          "isLoggedIn: false"
        );
        /*         
        Should be sessionId of session without user (because user is signed out).
        */
        expect(screen.getByTestId("sessionId")).toHaveTextContent(
          "sessionId123"
        );
      });

      expect(toast.success).toHaveBeenCalledWith("Sign out complete!");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("sign in, user is admin, session exists", () => {
    beforeEach(async () => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.mocked(awsAmplifyAuth.getCurrentUser).mockReset();
      vi.mocked(awsAmplifyAuth.fetchAuthSession).mockReset();
      vi.mocked(awsAmplifyAuth.signIn).mockReset();
    });

    test("should call AWS signIn for user as admin, causing isAdmin to be set to true", async () => {
      const user = userEvent.setup();

      vi.mocked(awsAmplifyAuth.getCurrentUser).mockRejectedValue(undefined);

      vi.mocked(awsAmplifyAuth.fetchAuthSession).mockRejectedValue(undefined);

      vi.mocked(awsAmplifyAuth.signIn).mockResolvedValue({
        nextStep: {
          signInStep: "DONE",
        },
        isSignedIn: true,
      });

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
        expect(screen.getByTestId("isLoggedIn")).toHaveTextContent(
          "isLoggedIn: false"
        );
        expect(screen.getByTestId("isAdmin")).toHaveTextContent(
          "isAdmin: false"
        );
      });

      const signInButton = screen.getByRole("button", { name: "Sign In" });

      expect(signInButton).toBeInTheDocument();

      vi.mocked(awsAmplifyAuth.fetchAuthSession).mockResolvedValue({
        tokens: {
          accessToken: {
            payload: {
              "cognito:groups": ["adminUsers"],
            },
          },
        },
      });

      vi.mocked(awsAmplifyAuth.getCurrentUser).mockResolvedValue(mockUser);

      await user.click(signInButton);

      expect(awsAmplifyAuth.signIn).toHaveBeenCalledWith({
        username: "testuser",
        password: "testpassword",
      });

      await waitFor(() => {
        expect(screen.getByTestId("isAuthStateKnown")).toHaveTextContent(
          "isAuthStateKnown: true"
        );
        expect(screen.getByTestId("isLoggedIn")).toHaveTextContent(
          "isLoggedIn: true"
        );
        expect(screen.getByTestId("isAdmin")).toHaveTextContent(
          "isAdmin: true"
        );
      });
    });
  });
});
