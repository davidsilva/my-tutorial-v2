import { AuthContext, AuthContextType } from "../context/AuthContext";
import * as awsAmplifyAuth from "aws-amplify/auth";
import useCheckForUser from "../hooks/useCheckForUser";
import useSession from "../hooks/useSession";
import useIsAdmin from "../hooks/useIsAdmin";

vi.mock("aws-amplify/auth");

vi.mock("../hooks/useCheckForUser", () => {
  return {
    default: () => ({
      user: null,
      isLoading: false,
      isCheckRun: true,
      checkUser: vi.fn(),
      reset: vi.fn(),
    }),
  };
});

vi.mock("../hooks/useSession", () => {
  return {
    default: () => ({
      session: null,
      isLoading: false,
      isSessionCheckRun: true,
      checkSession: vi.fn(),
      reset: vi.fn(),
      setIsSessionCheckRun: vi.fn(),
      deleteSession: vi.fn(),
      updateSession: vi.fn(),
    }),
  };
});

vi.mock("../hooks/useIsAdmin", () => {
  return {
    default: () => ({
      isAdmin: false,
      isLoading: false,
      isCheckRun: true,
      checkIsAdmin: vi.fn(),
      reset: vi.fn(),
      setIsCheckRun: vi.fn(),
    }),
  };
});

const mockAuthContextValue: AuthContextType = {
  signInStep: "",
  setSignInStep: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
  confirmSignIn: vi.fn(),
  resetAuthState: vi.fn(),
  intendedPath: "",
  setIntendedPath: vi.fn(),
  authState: {
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    sessionId: null,
    isAuthStateKnown: true,
  },
};

export const MockAuthProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthContext.Provider value={mockAuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
