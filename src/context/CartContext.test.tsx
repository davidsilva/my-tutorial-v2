import React, { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { CartContextProvider, useCartContext } from "./CartContext";
import userEvent from "@testing-library/user-event";
import { Product, CartItem, ListCartItemsQuery } from "../API";
import {
  useAuthContext,
  AuthContextProvider,
  AuthContextType,
  AuthStateType,
} from "../context/AuthContext";
import { listCartItemsWithProduct } from "../graphql/customQueries";
import {
  createCartItem,
  deleteCartItem,
  updateCartItem,
} from "../graphql/mutations";

const mockProduct: Product = {
  __typename: "Product",
  id: "100",
  name: "Product 100",
  description: "Description 100",
  price: 100,
  createdAt: "2021-09-01T00:00:00.000Z",
  updatedAt: "2021-09-01T00:00:00.000Z",
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

vi.mock("aws-amplify/api", () => {
  return {
    generateClient: () => ({
      graphql: vi.fn().mockImplementation(({ query, variables }) => {
        if (query === listCartItemsWithProduct) {
          return Promise.resolve({
            data: {
              listCartItems: {
                items: mockCartItems as CartItem[],
                nextToken: "",
              },
            } as ListCartItemsQuery,
          });
        }
        // createCartItem
        if (query === createCartItem) {
          const { input } = variables;
          const returnValue = {
            data: {
              createCartItem: {
                ...input,
                id: "100",
                createdAt: "2021-09-01T00:00:00.000Z",
                updatedAt: "2021-09-01T00:00:00.000Z",
                __typename: "CartItem",
              },
            },
          };
          console.log("createCartItem", returnValue);
          mockCartItems.push(returnValue.data.createCartItem);
          console.log("mockCartItems", mockCartItems);
          return Promise.resolve(returnValue);
        }
        // deleteCartItem
        if (query === deleteCartItem) {
          const { input } = variables;
          mockCartItems = mockCartItems.filter(
            (cartItem) => cartItem.id !== input.id
          );
          console.log("mockCartItems", mockCartItems);
          return Promise.resolve({ data: { deleteCartItem: null } });
        }
        // updateCartItem
      }),
    }),
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
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      sessionId: "1234",
      isAuthStateKnown: true,
    } as AuthStateType,
  } as AuthContextType),
}));

const TestComponent: React.FC = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    totalAmount,
    clearCart,
    incrementQuantity,
    decrementQuantity,
  } = useCartContext();

  useEffect(() => {
    console.log("cartItems", cartItems);
  }, [cartItems]);

  return (
    <div>
      <div data-testid="total-amount">{totalAmount}</div>
      <ul>
        {cartItems.map((cartItem) => (
          <li key={cartItem.id}>
            {cartItem.product?.name} - {cartItem.quantity}
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

const renderComponent = (initialState?: CartItem[]) => {
  render(
    <AuthContextProvider>
      <CartContextProvider initialState={initialState}>
        <TestComponent />
      </CartContextProvider>
    </AuthContextProvider>
  );
};

describe("CartContext", () => {
  describe("initial cart", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      renderComponent();
      await waitFor(() => {});
    });

    test("3 distinct products, total price 6", () => {
      const totalAmount = screen.getByTestId("total-amount");
      expect(totalAmount).toHaveTextContent("6");

      const cartDistinctProducts = screen.queryAllByRole("listitem");
      expect(cartDistinctProducts).toHaveLength(3);
    });

    test("should add product to cart", async () => {
      /* 
      Not sure how to mock the behavior of the GraphQL server, which would make a connection between CartItem and Product. Without that connection, how can we verify the price of the added item? Also, the total amount can't be calculated correctly, as price is a property of the product.
       */
      const user = userEvent.setup();

      const addToCartButton = screen.getByTestId("add-to-cart");
      await user.click(addToCartButton);

      await waitFor(() => {
        const cartItems = screen.queryAllByRole("listitem");
        expect(cartItems).toHaveLength(4);
      });
    });

    test("should remove product from cart", async () => {
      const user = userEvent.setup();

      const addToCartButton = screen.getByTestId("add-to-cart");
      await user.click(addToCartButton);

      const removeFromCartButton = screen.getByTestId("remove-100");
      await user.click(removeFromCartButton);

      await waitFor(() => {
        const cartItems = screen.queryAllByRole("listitem");
        expect(cartItems).toHaveLength(3);
      });
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
