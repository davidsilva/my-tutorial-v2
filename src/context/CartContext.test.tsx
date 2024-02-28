import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { CartContextProvider, useCartContext } from "./CartContext";
import userEvent from "@testing-library/user-event";
import { Product } from "../API";
import { CartItem } from "./CartContext";
import { AuthContextProvider } from "./AuthContext";
import { MemoryRouter } from "react-router-dom";

const mockProduct: Product = {
  id: "100",
  name: "Product 100",
  description: "Description 100",
  price: 100,
  createdAt: "2021-09-01T00:00:00.000Z",
  updatedAt: "2021-09-01T00:00:00.000Z",
  __typename: "Product",
};

const mockCartItems: CartItem[] = [
  {
    id: "1",
    name: "Product 1",
    description: "Description 1",
    price: 100,
    createdAt: "2021-09-01T00:00:00.000Z",
    updatedAt: "2021-09-01T00:00:00.000Z",
    __typename: "Product",
    quantity: 2,
  },
  {
    id: "2",
    name: "Product 2",
    description: "Description 2",
    price: 200,
    createdAt: "2021-09-01T00:00:00.000Z",
    updatedAt: "2021-09-01T00:00:00.000Z",
    __typename: "Product",
    quantity: 3,
  },
  {
    id: "3",
    name: "Product 3",
    description: "Description 3",
    price: 300,
    createdAt: "2021-09-01T00:00:00.000Z",
    updatedAt: "2021-09-01T00:00:00.000Z",
    __typename: "Product",
    quantity: 4,
  },
];

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

  return (
    <div>
      <div data-testid="total-amount">{totalAmount}</div>
      <ul>
        {cartItems.map((cartItem) => (
          <li key={cartItem.id}>
            {cartItem.name} - {cartItem.quantity}
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

const renderComponent = async (initialState?: CartItem[]) => {
  // We might not need waitFor -- yet.
  await waitFor(() => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <CartContextProvider initialState={initialState}>
            <TestComponent />
          </CartContextProvider>
        </AuthContextProvider>
      </MemoryRouter>
    );
  });
};

describe("CartContext", () => {
  describe("when cart is empty", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      await renderComponent();
    });
    test("cartItems should be empty by default", () => {
      const totalAmount = screen.getByTestId("total-amount");
      expect(totalAmount).toHaveTextContent("0");

      const cartItems = screen.queryAllByRole("listitem");
      expect(cartItems).toHaveLength(0);
    });

    test("should add product to cart", async () => {
      const user = userEvent.setup();

      const addToCartButton = screen.getByTestId("add-to-cart");
      await user.click(addToCartButton);

      const totalAmount = screen.getByTestId("total-amount");
      expect(totalAmount).toHaveTextContent("100");

      const cartItems = screen.queryAllByRole("listitem");
      expect(cartItems).toHaveLength(1);
    });
    test("should remove product from cart", async () => {
      const user = userEvent.setup();

      const addToCartButton = screen.getByTestId("add-to-cart");
      await user.click(addToCartButton);

      const removeFromCartButton = screen.getByTestId("remove-100");
      await user.click(removeFromCartButton);

      const totalAmount = screen.getByTestId("total-amount");
      expect(totalAmount).toHaveTextContent("0");

      const cartItems = screen.queryAllByRole("listitem");
      expect(cartItems).toHaveLength(0);
    });
    test("should remove product from cart when quantity is 0", async () => {
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
    });
  });
  describe("when cart is not empty", () => {
    beforeEach(async () => {
      vi.clearAllMocks();

      await renderComponent(mockCartItems);
    });
    test("cartItems should be populated with initial state", () => {
      const totalAmount = screen.getByTestId("total-amount");
      expect(totalAmount).toHaveTextContent("2000");

      const cartItems = screen.queryAllByRole("listitem");
      expect(cartItems).toHaveLength(3);
    });
    test("should clear cart", async () => {
      const user = userEvent.setup();

      const clearCartButton = screen.getByTestId("clear-cart");
      await user.click(clearCartButton);

      const totalAmount = screen.getByTestId("total-amount");
      expect(totalAmount).toHaveTextContent("0");

      const cartItems = screen.queryAllByRole("listitem");
      expect(cartItems).toHaveLength(0);
    });
    test("should increment product quantity", async () => {
      const user = userEvent.setup();
      const incrementQuantityButton = screen.getByTestId("increment-1");
      await user.click(incrementQuantityButton);
      const cartItems = screen.queryAllByRole("listitem");
      expect(cartItems).toHaveLength(3);
      const totalAmount = screen.getByTestId("total-amount");
      expect(totalAmount).toHaveTextContent("2100");
    });
    test("should decrement product quantity", async () => {
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
