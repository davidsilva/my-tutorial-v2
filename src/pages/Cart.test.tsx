import { CartContextProvider } from "../context/CartContext";
import { Cart } from "./";
import { CartItem } from "../context/CartContext";
import { render, screen, waitFor, within } from "@testing-library/react";
import { AuthContextProvider } from "../context/AuthContext";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

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

const renderComponent = async () => {
  await waitFor(() => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <CartContextProvider>
            <Cart />
          </CartContextProvider>
        </AuthContextProvider>
      </MemoryRouter>
    );
  });
};

describe("cart", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    useCartContextMock.mockReturnValue({
      cartItems: mockCartItems,
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      totalAmount: 2000,
      clearCart: vi.fn(),
      incrementQuantity: vi.fn(),
      decrementQuantity: vi.fn(),
    });

    await renderComponent();
  });
  test("should render cart items", async () => {
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
    expect(screen.getByText("Product 3")).toBeInTheDocument();
  });
  test("should call removeFromCart", async () => {
    const user = userEvent.setup();
    const nthRow = 1;
    const row = screen.getAllByRole("row")[nthRow];

    const removeButton = within(row).getByRole("button", {
      name: "remove from cart",
    });

    expect(removeButton).toBeInTheDocument();

    expect(screen.queryByText("Product 1")).toBeInTheDocument();

    await user.click(removeButton);

    expect(useCartContextMock().removeFromCart).toHaveBeenCalledWith(
      mockCartItems[nthRow - 1]
    );
  });
  test("should call incrementQuantity", async () => {
    const user = userEvent.setup();
    const nthRow = 1;
    const row = screen.getAllByRole("row")[nthRow];

    const incrementButton = within(row).getByRole("button", {
      name: "increment quantity",
    });

    expect(incrementButton).toBeInTheDocument();

    expect(screen.queryByText("Product 1")).toBeInTheDocument();

    await user.click(incrementButton);

    expect(useCartContextMock().incrementQuantity).toHaveBeenCalledWith(
      mockCartItems[nthRow - 1]
    );
  });
  test("should call decrementQuantity", async () => {
    const user = userEvent.setup();

    const nthRow = 1;
    const row = screen.getAllByRole("row")[nthRow];

    const decrementButton = within(row).getByRole("button", {
      name: "decrement quantity",
    });

    expect(decrementButton).toBeInTheDocument();

    expect(screen.queryByText("Product 1")).toBeInTheDocument();

    await user.click(decrementButton);

    expect(useCartContextMock().decrementQuantity).toHaveBeenCalledWith(
      mockCartItems[nthRow - 1]
    );
  });
  test("should call clearCart", async () => {
    const user = userEvent.setup();

    const clearButton = screen.getByRole("button", { name: /clear cart/i });

    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);

    expect(useCartContextMock().clearCart).toHaveBeenCalled();
  });
  test.todo("should proceed to checkout");
});
