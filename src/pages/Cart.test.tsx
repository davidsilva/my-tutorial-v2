import { CartContextProvider } from "../context/CartContext";
import { Cart } from "./";
import { CartItem } from "../context/CartContext";
import { render } from "@testing-library/react";

const { mockCartItems } = vi.hoisted(() => {
  return {
    mockCartItems: [
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
    ] as CartItem[],
  };
});

vi.mock("aws-amplify/auth");

const { useCartContextMock } = vi.hoisted(() => {
  return {
    useCartContextMock: vi.fn().mockReturnValue({
      cartItems: mockCartItems,
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

const renderComponent = () => {
  render(
    <CartContextProvider>
      <Cart />
    </CartContextProvider>
  );
};

describe("cart", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    renderComponent();
  });
  test.todo("should remove product from cart");
  test.todo("should remove product from cart when quantity is 0");
  test.todo("should increment product quantity");
  test.todo("should decrement product quantity");
  test.todo("should clear cart");
  test.todo("should proceed to checkout");
});
