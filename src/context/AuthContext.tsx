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
import { AsyncProcessStatus } from "../types";

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

export const AuthContext = createContext<AuthContextType | null>(null);

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
  const { adminCheck, checkIsAdmin } = useIsAdmin();
  const { userCheck, checkUser } = useCheckForUser();
  const { sessionCheck, getSession, deleteSession } = useSession();

  // Start off by calling checkUser -- unless it is already in
  // PENDING or SUCCESS state.
  useEffect(() => {
    if (userCheck.status === AsyncProcessStatus.NONE) {
      checkUser();
    }
  }, [authState.isAuthStateKnown, checkUser, userCheck.status]);

  // If useCheckForUser is in SUCCESS state, then call getSession(user).
  useEffect(() => {
    if (userCheck.status === AsyncProcessStatus.SUCCESS) {
      getSession(userCheck.value.user);
    }
  }, [userCheck, getSession]);

  // if useSession is in SUCCESS state, then set the sessionId in authState.
  useEffect(() => {
    if (sessionCheck.status === AsyncProcessStatus.SUCCESS) {
      setAuthState((prevState) => ({
        ...prevState,
        sessionId: sessionCheck.value.session?.id,
      }));
    }
  }, [sessionCheck]);

  /* 
  If useCheckForUser is in SUCCESS state and the user is not null, then call checkIsAdmin.
  */
  useEffect(() => {
    if (userCheck.status === AsyncProcessStatus.SUCCESS) {
      checkIsAdmin();
    }
  }, [userCheck, checkIsAdmin]);

  /*
    If we have a SUCCESS state for useCheckForUser, useIsAdmin, and useSession, then set isAuthStateKnown to true.
  */
  useEffect(() => {
    if (
      userCheck.status === AsyncProcessStatus.SUCCESS &&
      adminCheck.status === AsyncProcessStatus.SUCCESS &&
      sessionCheck.status === AsyncProcessStatus.SUCCESS
    ) {
      setAuthState((prevState) => ({
        ...prevState,
        isLoggedIn: !!userCheck.value.user,
        isAdmin: adminCheck.value.isAdmin,
        user: userCheck.value.user,
        isAuthStateKnown: true,
      }));
    }
  }, [userCheck, adminCheck, sessionCheck]);

  /*
    When authState is not known (as after resetChecks is called), we want to know it. So, we call checkUser.
  */
  useEffect(() => {
    if (!authState.isAuthStateKnown) {
      checkUser();
    }
  }, [authState.isAuthStateKnown, checkUser]);

  const resetChecks = () => {
    setAuthState((prevState) => ({
      ...prevState,
      isAuthStateKnown: false,
    }));
  };

  const resetAuthState = () => {
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
      const nextStep = result.nextStep;

      setSignInStep(nextStep.signInStep);

      if (nextStep.signInStep === "DONE") {
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
      toast.error(`There was a problem signing you in: ${authError.message}`);
      // console.error("error signing in", error);
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

      setAuthState((prevState) => ({
        ...prevState,
        isLoggedIn: isSignedIn,
        isAuthStateKnown: false,
      }));
      setSignInStep(nextStep.signInStep);
      if (nextStep.signInStep === "DONE") {
        toast.success("Sign in confirmed successfully!");
        navigate("/");
      }
    } catch (error) {
      const authError = error as AuthError;
      setAuthState((prevState) => ({
        ...prevState,
        isLoggedIn: false,
      }));
      toast.error(
        `There was a problem confirming your sign in: ${authError.message}`
      );
      // console.error("error confirming sign in", error);
    }
  };

  const signOut = async (navigate: NavigateFunction) => {
    const sessionId = authState.sessionId;
    try {
      await awsSignOut();
      if (sessionId) {
        // Soft-delete the session.
        await deleteSession(sessionId);
      }
      resetChecks();
      toast.success("Sign out complete!");
      navigate("/");
    } catch (error) {
      const authError = error as AuthError;
      toast.error(`There was a problem signing you out: ${authError.message}`);
      // console.error("could not sign out", authError);
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
      // console.error("could not sign up", error);
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
      // console.error("error confirming sign up", error);
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
