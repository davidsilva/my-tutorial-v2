import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import SignIn from "./SignIn";
import { AuthContextType, AuthStateType } from "../context/AuthContext";
import { MemoryRouter } from "react-router-dom";
import { MockAuthProvider } from "../__mocks__/MockAuthProvider";

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
        user: { username: "testuser", userId: "123" },
        isAdmin: false,
        sessionId: "123",
      } as AuthStateType,
    } as AuthContextType),
  };
});

vi.mock("../context/AuthContext", async () => {
  const actual = await import("../context/AuthContext");
  return {
    ...actual,
    useAuthContext: useAuthContextMock,
  };
});

vi.mock("aws-amplify/auth");

const renderSignIn = async () => {
  await waitFor(() => {
    render(
      <MemoryRouter>
        <MockAuthProvider>
          <SignIn />
        </MockAuthProvider>
      </MemoryRouter>
    );
  });
};

describe("Sign In page", () => {
  beforeEach(async () => {
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

    await renderSignIn();
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
  beforeEach(async () => {
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

    await renderSignIn();
  });

  test("does not show sign in form if user is already signed in", async () => {
    const signInForm = screen.queryByRole("form", {
      name: /sign in form/i,
    });
    expect(signInForm).not.toBeInTheDocument();

    expect(screen.getByText(/you are already signed in/i)).toBeInTheDocument();
  });
});
