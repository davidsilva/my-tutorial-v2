import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import {
  AuthContextProvider,
  AuthContextType,
  AuthStateType,
} from "../context/AuthContext";

vi.mock("aws-amplify/auth");

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

vi.mock("../context/AuthContext", async () => ({
  AuthContextProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useAuthContext: useAuthContextMock,
}));

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

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("redirects to /signin when not logged in", async () => {
    useAuthContextMock.mockReturnValue({
      ...useAuthContextMock(),
      authState: {
        isLoggedIn: false,
        isAuthStateKnown: true,
        user: null,
        isAdmin: false,
        sessionId: null,
      },
    });

    render(
      <MemoryRouter>
        <AuthContextProvider>
          <ProtectedRoute />
        </AuthContextProvider>
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });

  test("redirects to /not-authorized when not logged in as admin", async () => {
    useAuthContextMock.mockReturnValue({
      ...useAuthContextMock(),
      authState: {
        ...useAuthContextMock().authState,
        isLoggedIn: true,
        isAdmin: false,
      },
    });

    render(
      <MemoryRouter>
        <AuthContextProvider>
          <ProtectedRoute role="admin" />
        </AuthContextProvider>
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/not-authorized");
  });

  test("renders children when user is logged in and has correct role", async () => {
    useAuthContextMock.mockReturnValue({
      ...useAuthContextMock(),
      authState: {
        ...useAuthContextMock().authState,
        isLoggedIn: true,
        isAdmin: true,
      },
    });

    render(
      <MemoryRouter>
        <AuthContextProvider>
          <ProtectedRoute role="admin">
            <div>Protected content</div>
          </ProtectedRoute>
        </AuthContextProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  test.todo("should redirect to intended path after sign in");
});
