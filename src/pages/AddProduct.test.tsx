import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddProduct } from "./";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContextProvider } from "../context/AuthContext";

vi.mock("aws-amplify/auth");
vi.mock("aws-amplify/storage", () => ({
  uploadData: vi.fn().mockResolvedValue({ result: { key: "chucknorris.png" } }),
}));

const { useAuthContextMock } = vi.hoisted(() => {
  return {
    useAuthContextMock: vi.fn().mockReturnValue({
      isLoggedIn: true,
      signInStep: "",
      setSignInStep: vi.fn(),
      isAdmin: false,
      user: {
        userId: "1234",
        username: "testuser",
      },
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
      confirmSignUp: vi.fn(),
      confirmSignIn: vi.fn(),
      resetAuthState: vi.fn(),
    }),
  };
});

vi.mock("../context/AuthContext", async () => {
  const actual = await vi.importActual<typeof import("../context/AuthContext")>(
    "../context/AuthContext"
  );
  return {
    ...actual,
    useAuthContext: useAuthContextMock,
  };
});

const { graphqlMock } = vi.hoisted(() => {
  return { graphqlMock: vi.fn() };
});

const { postMock } = vi.hoisted(() => {
  return { postMock: vi.fn() };
});

vi.mock("aws-amplify/api", () => ({
  generateClient: () => ({
    graphql: graphqlMock,
  }),
  post: postMock,
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const fillInForm = async (
  productName: string,
  description: string,
  price: string,
  image?: File
) => {
  const user = userEvent.setup();
  const fileInput = screen.getByTestId("productImage");

  await user.type(screen.getByLabelText(/name/i), productName);
  await user.type(screen.getByLabelText(/description/i), description);
  await user.type(screen.getByLabelText(/price/i), price);
  if (image) {
    await user.upload(fileInput, image);
    await waitFor(() => {
      expect(screen.getByText("chucknorris.png")).toBeInTheDocument();
    });
  }
};

const renderAddProduct = async () => {
  await waitFor(() => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <AddProduct />
        </AuthContextProvider>
      </MemoryRouter>
    );
  });
};

const product = {
  name: "Test Product",
  description: "Test Description",
  price: 1099,
  image: "chucknorris.png",
};

describe("AddProduct", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "OPTIONS,POST,PUT",
      },
      body: JSON.stringify({
        message: "Product created successfully",
        product: {
          id: "1234",
          ...product,
          stripeProductId: "stripeProduct1",
          stripePriceId: "stripePrice1",
        },
      }),
    };

    postMock.mockResolvedValue(response);

    await renderAddProduct();
  });

  test("renders Add Product page", async () => {
    expect(
      screen.getByRole("heading", { name: "Add Product" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("form", { name: "product form" })
    ).toBeInTheDocument();
  });

  test("should call ProductAPI", async () => {
    const user = userEvent.setup();
    const file = new File(["(⌐□_□)"], "chucknorris.png", {
      type: "image/png",
    });

    await fillInForm("Test Product", "Test Description", "10.99", file);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith({
        apiName: "ProductAPI",
        path: "/product",
        options: {
          body: {
            operation: "create",
            payload: {
              Item: {
                name: "Test Product",
                description: "Test Description",
                price: 1099,
                image: "chucknorris.png",
              },
            },
          },
        },
      });
    });

    expect(toast.success).toHaveBeenCalledWith("Product added successfully");
  });
});
