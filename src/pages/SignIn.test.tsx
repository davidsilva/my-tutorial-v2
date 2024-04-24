import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SignIn from "./SignIn";
import {
  AuthContextProvider,
  AuthStateType,
  AuthContextType,
} from "../context/AuthContext";
import { MemoryRouter } from "react-router-dom";

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

const renderSignIn = () => {
  render(
    <MemoryRouter>
      <AuthContextProvider>
        <SignIn />
      </AuthContextProvider>
    </MemoryRouter>
  );
};

describe("Sign In page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuthContextMock).mockReturnValue({
      ...useAuthContextMock(),
      authState: {
        ...useAuthContextMock().authState,
        isLoggedIn: false,
        isAdmin: false,
        user: null,
      },
    });

    renderSignIn();
  });

  test("renders the sign in form if user is not already signed in", () => {
    const signInForm = screen.getByRole("form", { name: /sign in form/i });
    expect(signInForm).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /sign in/i })
    ).toBeInTheDocument();
  });
});

describe("Sign In page with user already signed in", () => {
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

    renderSignIn();
  });

  test("does not show sign in form if user is already signed in", () => {
    const signInForm = screen.queryByRole("form", {
      name: /sign in form/i,
    });
    expect(signInForm).not.toBeInTheDocument();

    expect(screen.getByText(/you are already signed in/i)).toBeInTheDocument();
  });
});
