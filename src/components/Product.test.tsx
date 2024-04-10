import { expect, test, beforeEach, vi, describe } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Product from "./Product";
import { Product as ProductType, Review } from "../API";
import { archiveProduct, restoreProduct } from "../graphql/customMutations";
import { AuthStateType, AuthContextType } from "../context/AuthContext";
import { ReactNode } from "react";
import { CartContextProvider } from "../context/CartContext";
import { MockAuthProvider } from "../__mocks__/MockAuthProvider";

const renderWithAuthContext = async (component: ReactNode) => {
  await waitFor(() => {
    render(
      <MemoryRouter>
        <MockAuthProvider>
          <CartContextProvider>{component}</CartContextProvider>
        </MockAuthProvider>
      </MemoryRouter>
    );
  });
};

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

const mockProduct: ProductType = {
  __typename: "Product",
  createdAt: "2022-01-01T00:00:00Z",
  updatedAt: "2022-01-01T00:00:00Z",
  id: "1",
  name: "Test Product",
  description: "This is a test product",
  price: 999,
  isArchived: false,
  image: "test-product.jpg",
  reviews: {
    __typename: "ModelReviewConnection",
    items: [
      { id: "1", rating: 5, content: "Great product" } as Review,
      { id: "2", rating: 4, content: "Good product" } as Review,
    ],
  },
};

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

const { graphqlMock } = vi.hoisted(() => {
  return {
    graphqlMock: vi.fn((query) => {
      if (query === archiveProduct || query === restoreProduct) {
        return Promise.resolve({});
      }
    }),
  };
});

vi.mock("aws-amplify/api", () => ({
  generateClient: vi.fn(() => ({
    graphql: graphqlMock,
  })),
}));

vi.mock("aws-amplify/auth");

describe("Product", () => {
  describe("render product for admin user", () => {
    beforeEach(async () => {
      vi.clearAllMocks();
      vi.mocked(useAuthContextMock).mockReturnValue({
        ...useAuthContextMock(),
        authState: {
          ...useAuthContextMock().authState,
          isAdmin: true,
        },
      });
    });

    test("renders edit and archive buttons for admin", async () => {
      await renderWithAuthContext(<Product product={mockProduct} />);
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /archive/i })
      ).toBeInTheDocument();
    });

    test("navigates to edit page when edit button is clicked", async () => {
      const user = userEvent.setup();

      await renderWithAuthContext(<Product product={mockProduct} />);

      const editButton = await screen.findByRole("button", { name: /Edit/i });

      await user.click(editButton);
      expect(mockNavigate).toHaveBeenCalledWith("/products/1/edit");
    });

    test("calls graphql with archiveProduct when archive button is clicked", async () => {
      const user = userEvent.setup();

      await renderWithAuthContext(<Product product={mockProduct} />);

      vi.mocked(graphqlMock).mockResolvedValueOnce({});

      const archiveButton = await screen.findByRole("button", {
        name: /Archive/i,
      });

      expect(archiveButton).toBeInTheDocument();

      await user.click(archiveButton);

      expect(graphqlMock).toHaveBeenCalledWith({
        query: archiveProduct,
        variables: { id: mockProduct.id },
      });

      expect(
        await screen.findByRole("button", { name: /Restore/i })
      ).toBeInTheDocument();
    });

    test("calls graphql with restoreProduct when restore button is clicked", async () => {
      const user = userEvent.setup();

      const archivedProduct = {
        ...mockProduct,
        isArchived: true,
      };

      vi.mocked(graphqlMock).mockResolvedValueOnce({});

      await renderWithAuthContext(<Product product={archivedProduct} />);

      const restoreButton = await screen.findByRole("button", {
        name: /restore/i,
      });

      expect(restoreButton).toBeInTheDocument();

      await user.click(restoreButton);

      expect(graphqlMock).toHaveBeenCalledWith({
        query: restoreProduct,
        variables: { id: mockProduct.id },
      });

      expect(
        await screen.findByRole("button", { name: /archive/i })
      ).toBeInTheDocument();
    });

    describe("renders for anonymous/unauthenticated user", () => {
      beforeEach(async () => {
        vi.clearAllMocks();

        vi.mocked(useAuthContextMock).mockReturnValue({
          ...useAuthContextMock(),
          authState: {
            ...useAuthContextMock().authState,
            isLoggedIn: false,
            isAdmin: false,
          },
        });

        await renderWithAuthContext(<Product product={mockProduct} />);
      });

      test("renders product without edit or archive buttons", async () => {
        const productImage = screen.getByRole("img");
        expect(productImage.getAttribute("src")).toMatch(/test-product\.jpg$/);
        expect(screen.getByLabelText("product name")).toHaveTextContent(
          "Test Product"
        );
        expect(screen.getByText("This is a test product")).toBeInTheDocument();
        expect(screen.getByText("9.99")).toBeInTheDocument();
        expect(screen.getByText("2 reviews")).toBeInTheDocument();
        expect(
          screen.queryByRole("button", { name: /edit/i })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole("button", { name: /archive/i })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("renders product for regular signed-in user", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      vi.mocked(useAuthContextMock).mockReturnValue({
        ...useAuthContextMock(),
        authState: {
          ...useAuthContextMock().authState,
          isAdmin: false,
          isLoggedIn: true,
        },
      });

      await renderWithAuthContext(<Product product={mockProduct} />);
    });

    test("renders product without edit or archive buttons", async () => {
      const productImage = screen.getByRole("img");
      expect(productImage.getAttribute("src")).toMatch(/test-product\.jpg$/);
      expect(screen.getByLabelText("product name")).toHaveTextContent(
        "Test Product"
      );
      expect(screen.getByText("This is a test product")).toBeInTheDocument();
      expect(screen.getByText("9.99")).toBeInTheDocument();
      expect(screen.getByText("2 reviews")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /edit/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /archive/i })
      ).not.toBeInTheDocument();
    });
  });
});
