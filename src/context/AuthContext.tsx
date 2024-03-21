import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useRef,
} from "react";
import {
  signUp as awsSignUp,
  confirmSignUp as awsConfirmSignUp,
  signIn as awsSignIn,
  confirmSignIn as awsConfirmSignIn,
  signOut as awsSignOut,
  getCurrentUser,
  AuthError,
  AuthUser,
  SignInInput,
  fetchAuthSession,
  ConfirmSignUpInput,
  ConfirmSignInInput,
} from "aws-amplify/auth";
import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";
import useIsAdmin from "../hooks/useIsAdmin";
import useLocalStorageSessionId from "../hooks/useLocalStorageSessionId";
import useSession from "../hooks/useSession";
import useCheckForUser from "../hooks/useCheckForUser";

type AuthContextProviderProps = {
  children: React.ReactNode;
  initialAuthState?: AuthContextType;
};

type SignUpType = {
  username: string;
  password: string;
  email: string;
};

export type AuthStateType = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: AuthUser | null;
  sessionId: string | null | undefined;
  isAuthStateKnown: boolean;
};

export type AuthContextType = {
  signInStep: string;
  setSignInStep: React.Dispatch<React.SetStateAction<string>>;
  signIn: (values: SignInInput, navigate: NavigateFunction) => Promise<void>;
  signOut: (navigate: NavigateFunction) => Promise<void>;
  signUp: (values: SignUpType, navigate: NavigateFunction) => Promise<void>;
  confirmSignUp: (
    values: ConfirmSignUpInput,
    navigate: NavigateFunction
  ) => Promise<void>;
  confirmSignIn: (
    values: ConfirmSignInInput,
    navigate: NavigateFunction
  ) => Promise<void>;
  resetAuthState: () => void;
  intendedPath?: string | null;
  setIntendedPath: React.Dispatch<React.SetStateAction<string | null>>;
  authState: AuthStateType | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

const defaultAuthState = {
  signInStep: "",
  setSignInStep: () => {},
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  confirmSignUp: async () => {},
  confirmSignIn: async () => {},
  resetAuthState: () => {},
  intendedPath: null,
  setIntendedPath: () => {},
  authState: null,
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
  initialAuthState,
}) => {
  const defaultState = initialAuthState || defaultAuthState;
  const [signInStep, setSignInStep] = useState(defaultState.signInStep);
  const [intendedPath, setIntendedPath] = useState<string | null>(
    defaultState.intendedPath || null
  );
  const [authState, setAuthState] = useState<AuthStateType>({
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    sessionId: null,
    isAuthStateKnown: false,
  });
  const {
    isAdmin,
    isLoading: isAdminCheckLoading,
    checkIsAdmin,
  } = useIsAdmin();
  const {
    isLoggedIn,
    isLoading: isUserCheckLoading,
    user,
    checkUser,
  } = useCheckForUser();
  const localStorageSessionId = localStorage.getItem("sessionId");
  const {
    session,
    createSession,
    updateSession,
    deleteSession,
    isLoading: isSessionLoading,
    getSession,
  } = useSession();

  useEffect(() => {
    if (!isUserCheckLoading && !isSessionLoading && !isAdminCheckLoading) {
      console.log("user, admin, and session check complete");
      console.log("user", user);
      console.log("session", session);
      console.log("isAdmin", isAdmin);

      // If we have a session, sessionId in authState should be set.
      // Likewise, with user.
      setAuthState((prevState) => ({
        ...prevState,
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        user: user,
        sessionId: session ? session.id : null,
        isAuthStateKnown: true,
      }));
    }
  }, [
    isUserCheckLoading,
    isSessionLoading,
    isAdminCheckLoading,
    isLoggedIn,
    isAdmin,
    session,
    user,
  ]);

  const resetAuthState = () => {
    setSignInStep(defaultState.signInStep);
    setAuthState({
      isLoggedIn: false,
      isAdmin: false,
      user: null,
      sessionId: null,
      isAuthStateKnown: false,
    });
    localStorage.removeItem("isLoggedIn");
  };

  const signIn = async (values: SignInInput, navigate: NavigateFunction) => {
    const { username, password } = values;

    try {
      const result = await awsSignIn({ username, password });
      console.log("result", result);
      const isSignedIn = result.isSignedIn;
      const nextStep = result.nextStep;

      setSignInStep(nextStep.signInStep);
      setAuthState((prevState) => ({
        ...prevState,
        isLoggedIn: isSignedIn,
      }));

      if (nextStep.signInStep === "DONE") {
        await checkUser();
        await checkIsAdmin();
        toast.success("Sign in complete!");
        navigate(intendedPath || "/");
        setIntendedPath(null);
      } else if (
        nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        toast.success("Please set a new password.");
        navigate("/signinconfirm");
      }
    } catch (error) {
      // NotAuthorizedException: Incorrect username or password.
      const authError = error as AuthError;
      // setIsLoggedIn(false);
      setAuthState((prevState) => ({
        ...prevState,
        isLoggedIn: false,
      }));
      toast.error(`There was a problem signing you in: ${authError.message}`);
      console.error("error signing in", error);
    }
  };

  const confirmSignIn = async (
    values: ConfirmSignInInput,
    navigate: NavigateFunction
  ) => {
    const { challengeResponse } = values;

    try {
      const { isSignedIn, nextStep } = await awsConfirmSignIn({
        challengeResponse: challengeResponse,
      });

      // setIsLoggedIn(isSignedIn);
      setAuthState((prevState) => ({
        ...prevState,
        isLoggedIn: isSignedIn,
      }));
      setSignInStep(nextStep.signInStep);
      // if (isSignedIn) {
      //   localStorage.setItem("isLoggedIn", "true");
      //   const isAdmin = await checkIsAdmin();
      //   setIsAdmin(isAdmin);
      // }
      if (nextStep.signInStep === "DONE") {
        navigate("/");
      }
    } catch (error) {
      const authError = error as AuthError;
      // setIsLoggedIn(false);
      setAuthState((prevState) => ({
        ...prevState,
        isLoggedIn: false,
      }));
      toast.error(
        `There was a problem confirming your sign in: ${authError.message}`
      );
      console.error("error confirming sign in", error);
    }
  };

  const signOut = async (navigate: NavigateFunction) => {
    // Mark session as ended or "should delete"?
    try {
      await awsSignOut();
      setAuthState((prevState) => ({
        ...prevState,
        isLoggedIn: false,
        isAdmin: false,
        user: null,
        sessionId: null,
      }));

      // assume if user signs out, they really don't want session
      // persisting in browser. So remove it.
      console.log("removing session");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("isLoggedIn");
      // setIsAdmin(false);
      // localStorage.removeItem("isLoggedIn");
      navigate("/");

      // await checkUser();
    } catch (error) {
      const authError = error as AuthError;
      toast.error(`There was a problem signing you out: ${authError.message}`);
      console.error("could not sign out", authError);
    }
  };

  const signUp = async (values: SignUpType, navigate: NavigateFunction) => {
    const { username, password, email } = values;

    try {
      await awsSignUp({
        username: username,
        password: password,
        options: {
          userAttributes: {
            email: email,
          },
          autoSignIn: false,
        },
      });
      navigate(`/signupconfirm/${username}`);
    } catch (error) {
      console.error("could not sign up", error);
      if (error instanceof AuthError) {
        toast.error(`There was a problem signing you up: ${error.message}`);
      }
    }
  };

  const confirmSignUp = async (
    values: ConfirmSignUpInput,
    navigate: NavigateFunction
  ) => {
    try {
      const result = await awsConfirmSignUp({
        username: values.username,
        confirmationCode: values.confirmationCode,
      });

      if (result.isSignUpComplete) {
        toast.success("Sign up complete!");
        navigate("/signin");
      }
    } catch (error) {
      if (error instanceof AuthError) {
        toast.error(
          `There was a problem confirming your sign up: ${error.message}`
        );
      }
      console.error("error confirming sign up", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }

  return context;
};
