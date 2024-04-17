import React, { useEffect, useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthContextProvider, useAuthContext } from "./AuthContext";
import userEvent from "@testing-library/user-event";
import * as awsAmplifyAuth from "aws-amplify/auth";
import { toast } from "react-toastify";
import { AuthError, AuthUser } from "aws-amplify/auth";
import { updateSession } from "../graphql/mutations";
import { Session, User } from "../API";
import { post, get, patch } from "aws-amplify/api";
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
      id: "sessionId123",
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
        console.log("get called for SessionAPI path:", path);
        // console.log("get called for SessionAPI", mockSessionWithoutUser);
        return {
          response: Promise.resolve({
            body: {
              json: vi.fn().mockResolvedValue(mockSessionWithoutUser),
            },
          }),
        };
      } else {
        console.log("get called for SessionAPI path:", path);
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
    setIntendedPath,
    authState,
  } = useAuthContext();

  // useEffect(() => {
  //   // console.log("authState", authState);
  // }, [authState]);xxx

  return (
    <>
      <div data-testid="isLoggedIn">
        isLoggedIn: {authState?.isLoggedIn ? "true" : "false"}
      </div>
      <div data-testid="signInStep">signInStep: {signInStep}</div>
      <div data-testid="isAdmin">
        isAdmin: {authState?.isAdmin ? "true" : "false"}
      </div>
      <div data-testid="user">username: {authState?.user?.username}</div>
      <div data-testid="sessionId">sessionId: {authState?.sessionId}</div>
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
    beforeEach(async () => {
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

      // eliminates warning about not waiting for state to be updated
      await waitFor(() => {});
    });

    test("should call AWS signIn with correct values for the case where confirmation (password change) is not required (user is not admin)", async () => {
      /* 
      In the real world a session should already exist because a session is created merely by visiting the site. In useSession.test.tsx we test that scenario...
      */
      window.localStorage.setItem("sessionId", "xxx");

      // mock for when sign-in confirmation is not required
      vi.mocked(awsAmplifyAuth.signIn).mockResolvedValueOnce({
        nextStep: {
          signInStep: "DONE",
        },
        isSignedIn: true,
      });

      // used by useCheckForUser hook
      vi.mocked(awsAmplifyAuth.getCurrentUser)
        .mockRejectedValueOnce(undefined) // user is initially not signed in
        .mockResolvedValue({
          username: "testuser",
          userId: "123456",
        });

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      const user = userEvent.setup();

      const isAdminStatus = screen.getByTestId("isAdmin");
      const signedInStatus = screen.getByTestId("isLoggedIn");
      const signInButton = screen.getByRole("button", { name: "Sign In" });

      expect(signedInStatus).toHaveTextContent("isLoggedIn: false");
      expect(isAdminStatus).toHaveTextContent("isAdmin: false");

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
      expect(get).toHaveBeenCalledWith({
        apiName: "SessionAPI",
        path: `/session/${mockSessionWithoutUser?.id}`,
      });
      expect(patch).toHaveBeenCalled();
      expect(post).toHaveBeenCalled();
    });

    test("should call toast with error message if AWS signIn throws an error", async () => {
      vi.mocked(awsAmplifyAuth.getCurrentUser).mockRejectedValue(undefined);

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      const user = userEvent.setup();

      vi.mocked(awsAmplifyAuth.signIn).mockRejectedValueOnce({
        message: "Incorrect username or password.",
      });

      const isAdminStatus = screen.getByTestId("isAdmin");
      const signedInStatus = screen.getByTestId("isLoggedIn");
      const signInButton = screen.getByRole("button", { name: "Sign In" });

      expect(signedInStatus).toHaveTextContent("isLoggedIn: false");

      expect(isAdminStatus).toHaveTextContent("isAdmin: false");

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

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      vi.mocked(awsAmplifyAuth.signIn).mockResolvedValueOnce({
        nextStep: {
          signInStep: "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED",
        },
        isSignedIn: false,
      });

      const isSignedInStatus = screen.getByTestId("isLoggedIn");
      const isAdminStatus = screen.getByTestId("isAdmin");

      expect(isSignedInStatus).toHaveTextContent("isLoggedIn: false");
      expect(isAdminStatus).toHaveTextContent("isAdmin: false");

      const signInButton = screen.getByRole("button", { name: "Sign In" });
      expect(signInButton).toBeInTheDocument();

      await user.click(signInButton);

      expect(isSignedInStatus).toHaveTextContent("isLoggedIn: false");
      expect(isAdminStatus).toHaveTextContent("isAdmin: false");

      expect(toast.success).toHaveBeenCalledWith("Please set a new password.");

      expect(mockNavigate).toHaveBeenCalledWith("/signinconfirm");
    });
  });

  describe("confirm sign in", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      vi.mocked(awsAmplifyAuth.getCurrentUser)
        .mockRejectedValueOnce(undefined)
        .mockResolvedValue({
          username: "testuser",
          userId: "123456",
        });

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      // eliminates warning about not waiting for state to be updated
      await waitFor(() => {});
    });

    test("should call AWS confirmSignIn with correct values and then call navigate with /", async () => {
      const user = userEvent.setup();

      vi.mocked(awsAmplifyAuth.confirmSignIn).mockResolvedValueOnce({
        isSignedIn: true,
        nextStep: {
          signInStep: "DONE",
        },
      });

      const confirmSignInButton = screen.getByRole("button", {
        name: "Confirm Sign In",
      });

      expect(confirmSignInButton).toBeInTheDocument();

      await user.click(confirmSignInButton);

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

      // Signing up doesn't sign user in
      vi.mocked(awsAmplifyAuth.getCurrentUser).mockRejectedValue(undefined);

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );

      // eliminates warning about not waiting for state to be updated
      await waitFor(() => {});
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
    });

    test("should call toast with error message if AWS signUp throws an error", async () => {
      const user = userEvent.setup();

      const authError = new AuthError({
        name: "some error",
        message: "some unknown error.",
      });

      vi.mocked(awsAmplifyAuth.signUp).mockRejectedValueOnce(authError);

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
      await waitFor(() => {});
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
    beforeEach(async () => {
      vi.clearAllMocks();

      render(
        <AuthContextProvider>
          <TestComponent />
        </AuthContextProvider>
      );
      await waitFor(() => {});
    });

    test("should call AWS signOut with correct values and then call navigate with /", async () => {
      const user = userEvent.setup();

      vi.mocked(awsAmplifyAuth.signOut).mockResolvedValueOnce(undefined);

      const signOutButton = screen.getByRole("button", { name: "Sign Out" });

      expect(signOutButton).toBeInTheDocument();

      await user.click(signOutButton);

      expect(awsAmplifyAuth.signOut).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Sign out complete!");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("sign in, user is admin, session exists", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      await waitFor(() => {});
    });

    test("should call AWS signIn for user as admin, causing isAdmin to be set to true", async () => {
      const user = userEvent.setup();

      vi.mocked(awsAmplifyAuth.getCurrentUser)
        .mockRejectedValueOnce(undefined)
        .mockResolvedValue({
          username: "testuser",
          userId: "123456",
        });

      vi.mocked(awsAmplifyAuth.fetchAuthSession).mockResolvedValue({
        tokens: {
          accessToken: {
            payload: {
              "cognito:groups": ["adminUsers"],
            },
          },
        },
      });

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

      const isAdminStatus = screen.getByTestId("isAdmin");
      const signedInStatus = screen.getByTestId("isLoggedIn");
      const signInButton = screen.getByRole("button", { name: "Sign In" });

      expect(signedInStatus).toHaveTextContent("isLoggedIn: false");

      expect(isAdminStatus).toHaveTextContent("isAdmin: false");

      expect(signInButton).toBeInTheDocument();

      await user.click(signInButton);

      expect(awsAmplifyAuth.signIn).toHaveBeenCalledWith({
        username: "testuser",
        password: "testpassword",
      });

      expect(signedInStatus).toHaveTextContent("isLoggedIn: true");

      expect(isAdminStatus).toHaveTextContent("isAdmin: true");
    });
  });
});
