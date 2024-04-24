import { render, screen, waitFor } from "@testing-library/react";
import { GetProductWithReviewsQuery } from "../API";
import ProductDetail from "./ProductDetail";
import { MemoryRouter } from "react-router-dom";
import {
  AuthContextProvider,
  AuthStateType,
  AuthContextType,
} from "../context/AuthContext";
import { CartContextProvider } from "../context/CartContext";

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

const { graphqlMock } = vi.hoisted(() => {
  const mockProduct: GetProductWithReviewsQuery["getProduct"] = {
    __typename: "Product",
    id: "372db325-5f72-49fa-ba8c-ab628c0ed470",
    name: "Test Product",
    description: "This is a test product",
    price: 999,
    isArchived: false,
    image: "test-product.jpg",
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2022-01-01T00:00:00Z",
    reviews: {
      __typename: "ModelReviewConnection",
      items: [
        {
          __typename: "Review",
          id: "1",
          owner: "johndoe",
          content: "Great product!",
          rating: 5,
          isArchived: false,
          productReviewsId: "372db325-5f72-49fa-ba8c-ab628c0ed470",
          createdAt: "2022-01-01T00:00:00Z",
          updatedAt: "2022-01-01T00:00:00Z",
        },
        {
          __typename: "Review",
          id: "2",
          owner: "testuser",
          content: "Not so good",
          rating: 2,
          isArchived: false,
          productReviewsId: "372db325-5f72-49fa-ba8c-ab628c0ed470",
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-01T00:00:00Z",
        },
      ],
    },
  };

  const graphqlMock = vi.fn().mockResolvedValue({
    data: {
      getProduct: mockProduct,
    },
    errors: null,
  });

  return { mockProduct, graphqlMock };
});

vi.mock("aws-amplify/api", () => ({
  generateClient: vi.fn(() => ({
    graphql: graphqlMock,
  })),
}));

vi.mock("react-router-dom", async () => {
  const router = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...router,
    useParams: vi
      .fn()
      .mockReturnValue({ productId: "372db325-5f72-49fa-ba8c-ab628c0ed470" }),
  };
});

vi.mock("aws-amplify/auth");

vi.mock("aws-amplify/api", () => ({
  generateClient: vi.fn(() => ({
    graphql: graphqlMock,
  })),
}));

const renderProductDetail = () => {
  render(
    <MemoryRouter>
      <AuthContextProvider>
        <CartContextProvider>
          <ProductDetail />
        </CartContextProvider>
      </AuthContextProvider>
    </MemoryRouter>
  );
};

describe("ProductDetail", () => {
  describe("anonymous user", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      vi.mocked(useAuthContextMock).mockReturnValue({
        ...useAuthContextMock(),
        authState: {
          ...useAuthContextMock().authState,
          isLoggedIn: false,
          user: null,
          isAdmin: false,
        },
      });

      renderProductDetail();
      await waitFor(() => {});
    });

    test("renders product details for anonymous user", () => {
      const productImage = screen.getByRole("img");
      expect(productImage.getAttribute("src")).toMatch(/test-product\.jpg$/);

      expect(screen.getByText("Test Product")).toBeInTheDocument();

      expect(screen.getByText("This is a test product")).toBeInTheDocument();

      expect(screen.getByText("9.99")).toBeInTheDocument();

      expect(screen.getByText("2 reviews")).toBeInTheDocument();

      expect(
        screen.getByRole("heading", { level: 2, name: "Reviews" })
      ).toBeInTheDocument();
    });
  });

  describe("logged in user", () => {
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

      renderProductDetail();
      await waitFor(() => {});
    });

    test("renders product details for logged in user", () => {
      const productImage = screen.getByRole("img");
      expect(productImage.getAttribute("src")).toMatch(/test-product\.jpg$/);

      expect(screen.getByText("Test Product")).toBeInTheDocument();

      expect(screen.getByText("This is a test product")).toBeInTheDocument();

      expect(screen.getByText("9.99")).toBeInTheDocument();

      expect(screen.getByText("2 reviews")).toBeInTheDocument();

      expect(
        screen.getByRole("heading", { level: 2, name: "Reviews" })
      ).toBeInTheDocument();
    });
  });

  describe("admin user", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      vi.mocked(useAuthContextMock).mockReturnValue({
        ...useAuthContextMock(),
        authState: {
          ...useAuthContextMock().authState,
          isLoggedIn: true,
          isAdmin: true,
          user: { username: "testuser", userId: "123" },
        },
      });

      renderProductDetail();
      await waitFor(() => {});
    });

    test("should show admin controls for admin user", () => {
      const editButton = screen.getByRole("button", { name: "Edit" });
      expect(editButton).toBeInTheDocument();

      const archiveButton = screen.getByRole("button", {
        name: /(archive)|(restore)/i,
      });
      expect(archiveButton).toBeInTheDocument();
    });
  });
});
