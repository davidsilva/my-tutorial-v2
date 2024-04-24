import { render, screen, waitFor } from "@testing-library/react";
import ListProducts from "./ListProducts";
import { MemoryRouter } from "react-router-dom";
import { ReactNode } from "react";
import { ProductWithReviews, ListProductsQueryWithReviews } from "../types";
import { Review } from "../API";
import userEvent from "@testing-library/user-event";
import { CartContextProvider } from "../context/CartContext";
import {
  AuthContextProvider,
  AuthContextType,
  AuthStateType,
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

const renderWithAuthContext = (component: ReactNode) => {
  render(
    <MemoryRouter>
      <AuthContextProvider>
        <CartContextProvider>{component}</CartContextProvider>
      </AuthContextProvider>
    </MemoryRouter>
  );
};

vi.mock("aws-amplify/api", () => {
  return {
    generateClient: () => ({
      graphql: vi.fn().mockResolvedValue({
        data: {
          listProducts: {
            items: [
              {
                id: "1",
                name: "Product 1",
                description: "Description 1",
                price: 1000,
                isArchived: false,
                reviews: {
                  items: Array(5).fill({
                    id: "1",
                    content: "Review 1",
                  } as Review),
                },
              },
              {
                id: "2",
                name: "Product 2",
                description: "Description 2",
                price: 2000,
                isArchived: false,
                reviews: {
                  items: Array(3).fill({
                    id: "2",
                    content: "Review 2",
                  } as Review),
                },
              },
            ] as ProductWithReviews[],
            nextToken: "",
          },
        } as ListProductsQueryWithReviews,
      }),
    }),
  };
});

vi.mock("aws-amplify/auth");

describe("ListProducts", () => {
  describe("when the user is signed in", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      vi.mocked(useAuthContextMock).mockReturnValueOnce({
        ...useAuthContextMock(),
        authState: {
          isLoggedIn: true,
          isAuthStateKnown: true,
          user: { username: "testuser", userId: "123" },
          isAdmin: false,
          sessionId: "123",
        } as AuthStateType,
      });

      renderWithAuthContext(<ListProducts />);
      await waitFor(() => {});
    });

    test("renders products for a signed-in user", async () => {
      const headings = await screen.findAllByRole("generic", {
        name: (_, element) => element?.classList.contains("product-name"),
      });

      expect(headings).toHaveLength(2);

      const productName = await screen.findByText("Product 1");
      const productDescription = await screen.findByText("Description 1");
      const productPrice = await screen.findByText("10");
      const reviewCount = await screen.findByText(/5 reviews/i);

      expect(productName).toBeInTheDocument();
      expect(productDescription).toBeInTheDocument();
      expect(productPrice).toBeInTheDocument();
      expect(reviewCount).toBeInTheDocument();
    });

    test.todo("should sort products by name", async () => {
      const user = userEvent.setup();

      const sortButton = await screen.findByRole("button", {
        name: /sort by name/i,
      });

      expect(sortButton).toBeInTheDocument();

      await user.click(sortButton);
    });

    test.todo("should sort products by price", async () => {});

    test.todo("should be able to toggle sort direction", async () => {});
  });

  describe("when the user is signed out", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      vi.mocked(useAuthContextMock).mockReturnValueOnce({
        ...useAuthContextMock(),
        authState: {
          isLoggedIn: false,
          isAuthStateKnown: true,
          user: null,
          isAdmin: false,
          sessionId: null,
        } as AuthStateType,
      });

      renderWithAuthContext(<ListProducts />);
      await waitFor(() => {});
    });

    test("renders products for a signed-out user", async () => {
      const headings = await screen.findAllByRole("generic", {
        name: (_, element) => element?.classList.contains("product-name"),
      });

      expect(headings).toHaveLength(2);

      const productName = await screen.findByText("Product 1");
      const productDescription = await screen.findByText("Description 1");
      const productPrice = await screen.findByText("10");
      const reviewCount = await screen.findByText(/5 reviews/i);

      expect(productName).toBeInTheDocument();
      expect(productDescription).toBeInTheDocument();
      expect(productPrice).toBeInTheDocument();
      expect(reviewCount).toBeInTheDocument();
    });
  });
});
