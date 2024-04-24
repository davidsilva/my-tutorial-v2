import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignInConfirm from "./SignInConfirm";
import {
  AuthContextProvider,
  AuthStateType,
  AuthContextType,
} from "../context/AuthContext";
import { MemoryRouter } from "react-router-dom";
import { ReactNode } from "react";

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

const { confirmSignInMock } = vi.hoisted(() => {
  return { confirmSignInMock: vi.fn().mockResolvedValue({}) };
});

const { useAuthContextMock } = vi.hoisted(() => {
  return {
    useAuthContextMock: vi.fn().mockReturnValue({
      signInStep: "",
      setSignInStep: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
      confirmSignUp: vi.fn(),
      confirmSignIn: confirmSignInMock,
      resetAuthState: vi.fn(),
      intendedPath: null,
      setIntendedPath: vi.fn(),
      authState: {
        isLoggedIn: true,
        isAuthStateKnown: true,
        user: { username: "testuser", userId: "1234" },
        isAdmin: false,
        sessionId: "123",
      } as AuthStateType,
    } as AuthContextType),
  };
});

vi.mock("../context/AuthContext", async () => ({
  AuthContextProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useAuthContext: useAuthContextMock,
}));

vi.mock("aws-amplify/auth");

const renderWithAuthContext = (component: ReactNode) => {
  render(
    <MemoryRouter>
      <AuthContextProvider>{component}</AuthContextProvider>
    </MemoryRouter>
  );
};

describe("SignInConfirm", () => {
  describe("Success path", () => {
    beforeEach(() => {
      vi.clearAllMocks();

      vi.mocked(confirmSignInMock).mockResolvedValue(undefined);

      renderWithAuthContext(<SignInConfirm />);
    });

    test("renders the sign in confirm form", () => {
      expect(
        screen.getByRole("heading", { name: /please set a new password/i })
      ).toBeInTheDocument();

      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    });

    test("user fills out and successfully submits the confirm sign in form", async () => {
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole("button", {
        name: /change password/i,
      });

      expect(submitButton).toBeInTheDocument();

      await user.type(passwordInput, "newpassword");
      await user.click(submitButton);

      expect(confirmSignInMock).toHaveBeenCalledTimes(1);
      expect(confirmSignInMock).toHaveBeenCalledWith(
        {
          challengeResponse: "newpassword",
        },
        mockNavigate
      );
    });
  });

  describe("Failure path", () => {
    beforeEach(() => {
      vi.clearAllMocks();

      vi.mocked(confirmSignInMock).mockRejectedValue({
        message: "error",
      });

      renderWithAuthContext(<SignInConfirm />);
    });

    test("user fills out and unsuccessfully submits the confirm sign in form", async () => {
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole("button", {
        name: /change password/i,
      });

      await user.type(passwordInput, "newpassword");
      await user.click(submitButton);

      expect(confirmSignInMock).toHaveBeenCalledTimes(1);
      expect(confirmSignInMock).toHaveBeenCalledWith(
        {
          challengeResponse: "newpassword",
        },
        mockNavigate
      );
    });
  });
});
