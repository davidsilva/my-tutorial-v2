import React, { useState, useContext, createContext, useEffect } from "react";
import {
  signUp as awsSignUp,
  confirmSignUp as awsConfirmSignUp,
  signIn as awsSignIn,
  confirmSignIn as awsConfirmSignIn,
  signOut as awsSignOut,
  AuthError,
  AuthUser,
  SignInInput,
  ConfirmSignUpInput,
  ConfirmSignInInput,
} from "aws-amplify/auth";
import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";
import useIsAdmin from "../hooks/useIsAdmin";
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
    isCheckRun: isAdminCheckRun,
    checkIsAdmin,
    setIsCheckRun: setIsAdminCheckRun,
    reset: resetIsAdminCheck,
  } = useIsAdmin();
  const {
    isLoading: isUserCheckLoading,
    isCheckRun: isUserCheckRun,
    user,
    checkUser,
    reset: resetUserCheck,
  } = useCheckForUser();
  const {
    session,
    deleteSession,
    isLoading: isSessionLoading,
    isSessionCheckRun,
    getSession,
    setIsSessionCheckRun,
    reset: resetSessionCheck,
  } = useSession();

  // When you don't know the authState...
  useEffect(() => {
    if (!isUserCheckRun || !isAdminCheckRun || !isSessionCheckRun) {
      console.log("setting isAuthStateKnown to false");
      setAuthState((prevState) => ({
        ...prevState,
        isAuthStateKnown: false,
      }));
    }
  }, [isUserCheckRun, isAdminCheckRun, isSessionCheckRun]);

  useEffect(() => {
    // Check whether user is signed in.
    // Make sure user check has not only started but also completed.

    // Could the user object be stale here?

    // We don't know isAuthStateKnown.
    if (isUserCheckRun && !isUserCheckLoading) {
      console.log("Setting user in authState", user);
      setAuthState((prevState) => ({
        ...prevState,
        user: user,
        isLoggedIn: !!user,
        isAuthStateKnown: false,
      }));
      getSession(user);
    }
  }, [isUserCheckRun, isUserCheckLoading, user, getSession]);

  useEffect(() => {
    if (!isUserCheckRun) {
      console.log("calling checkUser because isUserCheckRun is false");
      checkUser();
    }
  }, [checkUser, isUserCheckRun]);

  useEffect(() => {
    // Could session be stale here?
    if (
      isUserCheckRun &&
      !isUserCheckLoading &&
      isSessionCheckRun &&
      !isSessionLoading
    ) {
      if (session) {
        console.log("Setting sessionId in authState", session.id);
        setAuthState((prevState) => ({
          ...prevState,
          sessionId: session.id,
        }));
      }
    }
  }, [
    isSessionLoading,
    isSessionCheckRun,
    isUserCheckRun,
    isUserCheckLoading,
    session,
  ]);

  useEffect(() => {
    // Check whether user is an admin.
    if (isAdminCheckRun && !isAdminCheckLoading) {
      console.log("Setting isAdmin in authState", isAdmin);
      setAuthState((prevState) => ({
        ...prevState,
        isAdmin: isAdmin,
      }));
    }
  }, [isAdminCheckRun, isAdminCheckLoading, isAdmin]);

  useEffect(() => {
    console.log("calling checkIsAdmin because user changed", user);
    const checkIfUserIsAdmin = async () => {
      await checkIsAdmin();
    };
    // Whenever user changes, check whether user is an admin.
    checkIfUserIsAdmin();
  }, [checkIsAdmin, user]);

  // If we don't have a session, as after signOut, we need to create one.
  // Should signOut just set authState.sessionId to null and thereby trigger this?
  useEffect(() => {
    if (!authState.sessionId) {
      console.log(
        "authState.sessionId changed and authState.sessionId is falsey"
      );
      getSession(user);
    }
  }, [authState.sessionId]);

  useEffect(() => {
    if (
      isUserCheckRun &&
      !isUserCheckLoading &&
      isAdminCheckRun &&
      !isAdminCheckLoading &&
      isSessionCheckRun &&
      !isSessionLoading
    ) {
      console.log(
        "Everything has run, so setting isAuthStateKnown in authState to true"
      );
      setAuthState((prevState) => ({
        ...prevState,
        user: user,
        sessionId: session?.id,
        isAdmin: isAdmin,
        isLoggedIn: !!user,
        isAuthStateKnown: true,
      }));
    }
  }, [
    isAdmin,
    isAdminCheckLoading,
    isAdminCheckRun,
    isSessionCheckRun,
    isSessionLoading,
    isUserCheckLoading,
    isUserCheckRun,
    session?.id,
    user,
  ]);

  const resetChecks = () => {
    console.log("Resetting checks");
    setAuthState((prevState) => ({
      ...prevState,
      isAuthStateKnown: false,
    }));
    resetUserCheck();
    resetIsAdminCheck();
    resetSessionCheck();
  };

  const resetAuthState = () => {
    console.log("Resetting authState");
    setSignInStep(defaultState.signInStep);
    setAuthState({
      isLoggedIn: false,
      isAdmin: false,
      user: null,
      sessionId: null,
      isAuthStateKnown: true,
    });
    localStorage.removeItem("isLoggedIn");
  };

  const signIn = async (values: SignInInput, navigate: NavigateFunction) => {
    const { username, password } = values;

    try {
      const result = await awsSignIn({ username, password });
      console.log("result", result);
      const nextStep = result.nextStep;

      setSignInStep(nextStep.signInStep);

      if (nextStep.signInStep === "DONE") {
        console.log("about to call checkUser. authState", authState);
        resetChecks();

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
      await checkUser();
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
        isAuthStateKnown: false,
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
    console.log("SIGNING OUT");
    const sessionId = authState.sessionId;
    try {
      await awsSignOut();

      // Shouldn't need to call checkIsAdmin because user has changed.
      // And that should cause checkIsAdmin to be called.
      // await checkIsAdmin();
      // resetAuthState();
      console.log("removing session");
      if (sessionId) {
        await deleteSession(sessionId);
      }
      // await checkUser();
      resetChecks();
      navigate("/");
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
