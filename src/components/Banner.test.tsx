import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Banner from "./Banner";
import { ReactNode } from "react";
import { CartContextProvider } from "../context/CartContext";
import {
  useAuthContext,
  AuthContextProvider,
  AuthContextType,
  AuthStateType,
} from "../context/AuthContext";

const { mockNavigate } = vi.hoisted(() => {
  return { mockNavigate: vi.fn() };
});

const { signOutMock } = vi.hoisted(() => {
  return { signOutMock: vi.fn().mockResolvedValue(undefined) };
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

const { signInMock } = vi.hoisted(() => {
  return { signInMock: vi.fn().mockResolvedValue({}) };
});

vi.mock("../context/AuthContext", async () => ({
  AuthContextProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useAuthContext: vi.fn().mockReturnValue({
    signIn: signInMock,
    signOut: signOutMock,
    signInStep: "",
    setSignInStep: vi.fn(),
    signUp: vi.fn(),
    confirmSignUp: vi.fn(),
    confirmSignIn: vi.fn(),
    resetAuthState: vi.fn(),
    intendedPath: "",
    setIntendedPath: vi.fn(),
    authState: {
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      sessionId: "1234",
      isAuthStateKnown: false,
    } as AuthStateType,
  } as AuthContextType),
}));

const { useCartContextMock } = vi.hoisted(() => {
  return {
    useCartContextMock: vi.fn().mockReturnValue({
      cartItems: [],
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      totalAmount: 2000,
      clearCart: vi.fn(),
      incrementQuantity: vi.fn(),
      decrementQuantity: vi.fn(),
    }),
  };
});

vi.mock("../context/CartContext", async () => {
  const actual = await import("../context/CartContext");
  return {
    ...actual,
    useCartContext: useCartContextMock,
  };
});

vi.mock("aws-amplify/auth");

const renderWithAuthContext = (component: ReactNode) => {
  render(
    <MemoryRouter>
      <AuthContextProvider>
        <CartContextProvider>{component}</CartContextProvider>
      </AuthContextProvider>
    </MemoryRouter>
  );
};

describe("Banner", () => {
  describe("Not logged in", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      vi.mocked(useAuthContext).mockReturnValueOnce({
        signInStep: "",
        setSignInStep: vi.fn(),
        signIn: vi.fn(),
        signOut: signOutMock,
        signUp: vi.fn(),
        confirmSignUp: vi.fn(),
        confirmSignIn: vi.fn(),
        resetAuthState: vi.fn(),
        intendedPath: "",
        setIntendedPath: vi.fn(),
        authState: {
          user: null,
          isLoggedIn: false,
          isAdmin: false,
          sessionId: "1234",
          isAuthStateKnown: true,
        } as AuthStateType,
      } as AuthContextType);

      renderWithAuthContext(<Banner />);
    });

    test("renders site name", () => {
      const navElement = screen.getByRole("navigation");
      const withinNavElement = within(navElement);

      const siteNameElement = withinNavElement.getByText("Onyx Store");
      expect(siteNameElement).toBeInTheDocument();
    });

    test("renders Sign In and Sign Up but not Sign Out buttons when not logged in", () => {
      const navElement = screen.getByRole("navigation");
      const withinNavElement = within(navElement);

      const signInButton = withinNavElement.getByRole("button", {
        name: /^sign in$/i,
      });
      const signUpButton = withinNavElement.getByRole("button", {
        name: /^sign up$/i,
      });
      const signOutButton = screen.queryByRole("button", { name: /sign out/i });

      expect(signInButton).toBeInTheDocument();
      expect(signUpButton).toBeInTheDocument();
      expect(signOutButton).not.toBeInTheDocument();
    });

    test("navigates to /signin when Sign In button is clicked", async () => {
      const user = userEvent.setup();

      const signInButton = screen.getByRole("button", { name: /sign in/i });
      await user.click(signInButton);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/signin");
    });

    test("navigates to /signup when Sign Up button is clicked", async () => {
      const user = userEvent.setup();

      const signUpButton = screen.getByRole("button", { name: /sign up/i });
      await user.click(signUpButton);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/signup");
    });
  });

  describe("Logged in as admin", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      vi.mocked(useAuthContext).mockReturnValueOnce({
        signInStep: "",
        setSignInStep: vi.fn(),
        signIn: vi.fn(),
        signOut: signOutMock,
        signUp: vi.fn(),
        confirmSignUp: vi.fn(),
        confirmSignIn: vi.fn(),
        resetAuthState: vi.fn(),
        intendedPath: "",
        setIntendedPath: vi.fn(),
        authState: {
          user: {
            username: "testuser",
            userId: "testuserid",
          },
          isLoggedIn: true,
          isAdmin: true,
          sessionId: "1234",
          isAuthStateKnown: true,
        } as AuthStateType,
      } as AuthContextType);

      renderWithAuthContext(<Banner />);
    });

    test("reders Add Product link when logged in as admin", () => {
      const addProductLink = screen.getByRole("link", { name: /add product/i });
      expect(addProductLink).toBeInTheDocument();
      expect(addProductLink).toHaveAttribute("href", "/products/new");
    });
  });

  describe("Logged in as user", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      vi.mocked(useAuthContext).mockReturnValue({
        signInStep: "",
        setSignInStep: vi.fn(),
        signIn: vi.fn(),
        signOut: signOutMock,
        signUp: vi.fn(),
        confirmSignUp: vi.fn(),
        confirmSignIn: vi.fn(),
        resetAuthState: vi.fn(),
        intendedPath: "",
        setIntendedPath: vi.fn(),
        authState: {
          user: {
            username: "testuser",
            userId: "testuserid",
          },
          isLoggedIn: true,
          isAdmin: false,
          sessionId: "1234",
          isAuthStateKnown: true,
        } as AuthStateType,
      } as AuthContextType);

      renderWithAuthContext(<Banner />);
    });

    test("renders Sign Out button when logged in but not Sign In or Sign Up buttons", async () => {
      const user = userEvent.setup();

      const dropdownToggle = screen.getByRole("button", { name: /testuser/i });
      await user.click(dropdownToggle);

      const signOutButton = screen.getByRole("button", { name: /sign out/i });
      expect(signOutButton).toBeInTheDocument();

      const signInButton = screen.queryByRole("button", { name: /sign in/i });
      const signUpButton = screen.queryByRole("button", { name: /sign up/i });

      expect(signInButton).not.toBeInTheDocument();
      expect(signUpButton).not.toBeInTheDocument();
    });

    test("should contain a link to the user's profile", async () => {
      const user = userEvent.setup();

      const dropdownToggle = screen.getByRole("button", {
        name: /testuser/i,
      });
      await user.click(dropdownToggle);

      const profileLink = screen.getByRole("link", { name: /profile/i });
      expect(profileLink).toBeInTheDocument();
      expect(profileLink).toHaveAttribute("href", "/users/testuserid");
    });

    test("should contain a link to Change Password", async () => {
      const user = userEvent.setup();

      const dropdownToggle = screen.getByRole("button", {
        name: /testuser/i,
      });
      await user.click(dropdownToggle);

      const changePasswordLink = screen.getByRole("link", {
        name: /change password/i,
      });
      expect(changePasswordLink).toBeInTheDocument();
      expect(changePasswordLink).toHaveAttribute("href", "/changepassword");
    });

    test("calls signOut when Sign Out button is clicked and navigates to /signin", async () => {
      const user = userEvent.setup();

      const dropdownToggle = screen.getByRole("button", {
        name: /testuser/i,
      });
      await user.click(dropdownToggle);

      const signOutButton = screen.getByRole("button", {
        name: /sign out/i,
      });
      expect(signOutButton).toBeInTheDocument();
      await user.click(signOutButton);
      await waitFor(() => {
        expect(signOutMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
