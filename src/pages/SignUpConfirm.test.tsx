import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignUpConfirm from "./SignUpConfirm";
import userEvent from "@testing-library/user-event";
import {
  AuthContextProvider,
  AuthStateType,
  AuthContextType,
} from "../context/AuthContext";

const { useAuthContextMock } = vi.hoisted(() => {
  return {
    useAuthContextMock: vi.fn().mockReturnValue({
      signInStep: "",
      setSignInStep: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
      confirmSignUp: vi.fn(),
      confirmSignIn: vi.fn(),
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

const { mockNavigate } = vi.hoisted(() => {
  return { mockNavigate: vi.fn() };
});

vi.mock("react-router-dom", async () => {
  const router = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...router,
    useParams: vi.fn().mockReturnValue({ username: "testuser" }),
    useNavigate: vi.fn().mockReturnValue(mockNavigate),
  };
});

describe("SignUpConfirm page", () => {
  describe("when user is not signed in", () => {
    beforeEach(() => {
      vi.clearAllMocks();

      vi.mocked(useAuthContextMock).mockReturnValue({
        ...useAuthContextMock(),
        authState: {
          ...useAuthContextMock().authState,
          isLoggedIn: false,
        },
      });

      render(
        <MemoryRouter>
          <AuthContextProvider>
            <SignUpConfirm />
          </AuthContextProvider>
        </MemoryRouter>
      );
    });

    test("renders sign up confirmation form", () => {
      const usernameInput = screen.getByRole("textbox", {
        name: /^username$/i,
      });
      const confirmationCodeInput = screen.getByRole("textbox", {
        name: /^confirmation Code$/i,
      });
      const submitButton = screen.getByRole("button", { name: /^submit$/i });

      expect(usernameInput).toBeInTheDocument();
      expect(confirmationCodeInput).toBeInTheDocument();

      expect(usernameInput).toHaveValue("testuser");
      expect(submitButton).toBeInTheDocument();
    });

    test("calls confirmSignUp() with username, confirmation code and navigate fn", async () => {
      const user = userEvent.setup();

      const confirmationCodeInput = screen.getByRole("textbox", {
        name: /^confirmation Code$/i,
      });
      const submitButton = screen.getByRole("button", { name: /^submit$/i });

      await user.type(confirmationCodeInput, "123456");
      await user.click(submitButton);

      expect(useAuthContextMock().confirmSignUp).toHaveBeenCalledWith(
        { username: "testuser", confirmationCode: "123456" },
        mockNavigate
      );
    });

    test("displays error message when user does not enter confirmation code, and submit button is disabled", async () => {
      const user = userEvent.setup();

      const confirmationCodeInput = screen.getByRole("textbox", {
        name: /^confirmation Code$/i,
      });
      await user.type(confirmationCodeInput, "123456");
      await user.clear(confirmationCodeInput);

      const submitButton = screen.getByRole("button", { name: /^submit$/i });
      expect(submitButton).toBeDisabled();
      await user.click(submitButton);
      const confirmationCodeInputFeedback = confirmationCodeInput.nextSibling;
      expect(confirmationCodeInputFeedback).toHaveTextContent(/required/i);
    });
  });

  describe("when user is signed in", () => {
    beforeEach(() => {
      vi.clearAllMocks();

      vi.mocked(useAuthContextMock).mockReturnValue({
        ...useAuthContextMock(),
        authState: {
          ...useAuthContextMock().authState,
          isLoggedIn: true,
          isAdmin: false,
          user: { username: "testuser", userId: "123" },
        },
      });

      render(
        <MemoryRouter>
          <AuthContextProvider>
            <SignUpConfirm />
          </AuthContextProvider>
        </MemoryRouter>
      );
    });

    test("displays warning message when user is already signed in", async () => {
      expect(
        await screen.findByText(
          "You are already signed in. You have no business confirming :-D"
        )
      ).toBeInTheDocument();
    });
  });
});
