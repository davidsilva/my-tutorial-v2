import { signIn, signOut } from "aws-amplify/auth";
import amplifyconfig from "../amplifyconfiguration.json";
import React, { useEffect } from "react";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { CartContextProvider, useCartContext } from "./CartContext";
import userEvent from "@testing-library/user-event";
import { Product, CartItem, ListCartItemsQuery } from "../API";
import {
  useAuthContext,
  AuthContextProvider,
  AuthContextType,
  AuthStateType,
} from "../context/AuthContext";
import { listCartItemsWithProduct as listCartItemsWithProductQuery } from "../graphql/customQueries";
import {
  createCartItem as createCartItemMutation,
  deleteCartItem as deleteCartItemMutation,
  updateCartItem as updateCartItemMutation,
} from "../graphql/mutations";
import { Amplify } from "aws-amplify";
import { AsyncProcessStatus } from "../types";
import dotenv from "dotenv";

dotenv.config();

Amplify.configure(amplifyconfig);

const mockProduct: Product = {
  __typename: "Product",
  id: "dd4e05da-894d-451a-a3a8-f589441c00db",
  name: "Product Name",
  description: "Product Description",
  price: 10000,
  isArchived: false,
  image: "http://example.com/product.jpg",
  stripePriceId: "stripePriceId",
  stripeProductId: "stripeProductId",
  createdAt: "2024-05-01T23:42:28.706Z",
  updatedAt: "2024-05-01T23:42:28.706Z",
  owner: null,
};

let { mockCartItems } = vi.hoisted(() => {
  return {
    mockCartItems: [
      {
        id: "1",
        createdAt: "2021-09-01T00:00:00.000Z",
        updatedAt: "2021-09-01T00:00:00.000Z",
        __typename: "CartItem",
        product: {
          __typename: "Product",
          id: "1",
          name: "Product 1",
          description: "Description 1",
          price: 100,
          createdAt: "2021-09-01T00:00:00.000Z",
          updatedAt: "2021-09-01T00:00:00.000Z",
        },
        quantity: 2,
        sessionId: "1234",
        productId: "1",
      },
      {
        id: "2",
        createdAt: "2021-09-01T00:00:00.000Z",
        updatedAt: "2021-09-01T00:00:00.000Z",
        __typename: "CartItem",
        product: {
          __typename: "Product",
          id: "2",
          name: "Product 2",
          description: "Description 2",
          price: 100,
          createdAt: "2021-09-01T00:00:00.000Z",
          updatedAt: "2021-09-01T00:00:00.000Z",
        },
        quantity: 2,
        sessionId: "1234",
        productId: "2",
      },
      {
        id: "3",
        createdAt: "2021-09-01T00:00:00.000Z",
        updatedAt: "2021-09-01T00:00:00.000Z",
        __typename: "CartItem",
        product: {
          __typename: "Product",
          id: "3",
          name: "Product 3",
          description: "Description 3",
          price: 100,
          createdAt: "2021-09-01T00:00:00.000Z",
          updatedAt: "2021-09-01T00:00:00.000Z",
        },
        quantity: 2,
        sessionId: "1234",
        productId: "3",
      },
    ],
  };
});

vi.mock("../context/AuthContext", async () => ({
  AuthContextProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useAuthContext: vi.fn().mockReturnValue({
    signIn: vi.fn(),
    signOut: vi.fn(),
    signInStep: "",
    setSignInStep: vi.fn(),
    signUp: vi.fn(),
    confirmSignUp: vi.fn(),
    confirmSignIn: vi.fn(),
    resetAuthState: vi.fn(),
    intendedPath: "",
    setIntendedPath: vi.fn(),
    authState: {
      user: {
        username: "testuser00",
        userId: "e5b204b8-97bc-49d0-a1b5-b44a6fc532fb",
      },
      isLoggedIn: true,
      isAdmin: false,
      sessionId: "75c126d8-32f9-46e3-a97c-ee3285054869",
      isAuthStateKnown: true,
    } as AuthStateType,
  } as AuthContextType),
}));

const TestComponent: React.FC = () => {
  const {
    cartItemsProcess,
    addToCart,
    removeFromCart,
    totalAmount,
    clearCart,
    incrementQuantity,
    decrementQuantity,
  } = useCartContext();

  useEffect(() => {
    console.log("cartItemsProcess", JSON.stringify(cartItemsProcess));
  }, [cartItemsProcess]);

  if (cartItemsProcess.status !== AsyncProcessStatus.SUCCESS) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div data-testid="total-amount">{totalAmount}</div>
      <ul>
        {cartItemsProcess.value.items.map((cartItem) => (
          <li key={cartItem.id}>
            Name:
            <span data-testid={`name-${cartItem.product?.id}`}>
              {cartItem.product?.name}
            </span>
            Quantity:
            <span data-testid={`quantity-${cartItem.product?.id}`}>
              {cartItem.quantity}
            </span>
            Price:
            <span data-testid={`price-${cartItem.product?.id}`}>
              {cartItem.product?.price}
            </span>
            <button
              data-testid={`remove-${cartItem.id}`}
              onClick={() => removeFromCart(cartItem)}
            >
              Remove
            </button>
            <button
              data-testid={`increment-${cartItem.id}`}
              onClick={() => incrementQuantity(cartItem)}
            >
              Increase Quantity
            </button>
            <button
              data-testid={`decrement-${cartItem.id}`}
              onClick={() => decrementQuantity(cartItem)}
            >
              Decrease Quantity
            </button>
          </li>
        ))}
      </ul>
      <button data-testid="add-to-cart" onClick={() => addToCart(mockProduct)}>
        Add to cart
      </button>
      <button data-testid="clear-cart" onClick={() => clearCart()}>
        Clear Cart
      </button>
    </div>
  );
};

const renderComponent = () => {
  render(
    <AuthContextProvider>
      <CartContextProvider>
        <TestComponent />
      </CartContextProvider>
    </AuthContextProvider>
  );
};

beforeAll(async () => {
  const result = await signIn({
    username: "testuser00",
    password: "secret1234",
  });
  console.log("signIn result", result);
  console.log("dotenv admin username", process.env.TEST_ADMIN_USERNAME);
});

afterAll(async () => {
  await signOut();
});

describe("CartContext", () => {
  describe("initial cart", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      renderComponent();
      await waitForElementToBeRemoved(() => screen.getByText("Loading..."));
    });

    test.only("Should remove Loading... after cart items are loaded", async () => {
      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });
      screen.debug();
    });

    test.todo("0 distinct products, total price 0", () => {
      const totalAmount = screen.getByTestId("total-amount");
      expect(totalAmount).toHaveTextContent("800");

      const cartDistinctProducts = screen.queryAllByRole("listitem");
      expect(cartDistinctProducts).toHaveLength(3);
      // screen.debug();
    });

    test.todo("should add product to cart", async () => {
      const user = userEvent.setup();

      const addToCartButton = screen.getByTestId("add-to-cart");
      await user.click(addToCartButton);

      await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

      await waitFor(() => {
        expect(screen.getByText("Product 100")).toBeInTheDocument();
      });
      screen.debug();
    });

    test.todo("should remove product from cart", async () => {
      const user = userEvent.setup();

      // const removeFromCartButton = screen.getByTestId(
      //   "remove-8eb7b1df-fb6b-49a2-b85b-6123f04a8a9c"
      // );
      // await user.click(removeFromCartButton);

      // await waitFor(() => {
      //   const cartItems = screen.queryAllByRole("listitem");
      //   expect(cartItems).toHaveLength(2);
      // });
      screen.debug();
    });

    test.todo(
      "should remove product from cart when quantity is 0",
      async () => {
        const user = userEvent.setup();
        const addToCartButton = screen.getByTestId("add-to-cart");
        await user.click(addToCartButton);
        let cartItems = screen.queryAllByRole("listitem");
        let totalAmount = screen.getByTestId("total-amount");
        expect(cartItems).toHaveLength(1);
        expect(totalAmount).toHaveTextContent("100");

        const decrementQuantityButton = screen.getByTestId("decrement-100");
        await user.click(decrementQuantityButton);

        cartItems = screen.queryAllByRole("listitem");
        totalAmount = screen.getByTestId("total-amount");

        expect(cartItems).toHaveLength(0);
        expect(totalAmount).toHaveTextContent("0");
      }
    );
  });

  describe("when cart is not empty", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      renderComponent();
      await waitFor(() => {});
    });

    test.todo("cartItems should be populated with initial state", () => {
      const totalAmount = screen.getByTestId("total-amount");
      expect(totalAmount).toHaveTextContent("2000");

      const cartItems = screen.queryAllByRole("listitem");
      expect(cartItems).toHaveLength(3);
    });

    test.todo("should clear cart", async () => {
      const user = userEvent.setup();

      const clearCartButton = screen.getByTestId("clear-cart");
      await user.click(clearCartButton);

      const totalAmount = screen.getByTestId("total-amount");
      expect(totalAmount).toHaveTextContent("0");

      const cartItems = screen.queryAllByRole("listitem");
      expect(cartItems).toHaveLength(0);
    });

    test.todo("should increment product quantity", async () => {
      const user = userEvent.setup();
      const incrementQuantityButton = screen.getByTestId("increment-1");
      await user.click(incrementQuantityButton);
      const cartItems = screen.queryAllByRole("listitem");
      expect(cartItems).toHaveLength(3);
      const totalAmount = screen.getByTestId("total-amount");
      expect(totalAmount).toHaveTextContent("2100");
    });

    test.todo("should decrement product quantity", async () => {
      const user = userEvent.setup();
      const decrementQuantityButton = screen.getByTestId("decrement-1");
      await user.click(decrementQuantityButton);
      const cartItems = screen.queryAllByRole("listitem");
      expect(cartItems).toHaveLength(3);
      const totalAmount = screen.getByTestId("total-amount");
      expect(totalAmount).toHaveTextContent("1900");
    });
  });
});
