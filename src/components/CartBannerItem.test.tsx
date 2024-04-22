import { render, screen, waitFor } from "@testing-library/react";
import { CartContextProvider } from "../context/CartContext";
import { MemoryRouter } from "react-router-dom";
import CartBannerItem from "./CartBannerItem";
import { CartItem } from "../context/CartContext";
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

/* 
CartBannerItem doesn't need AuthContext (at least for now), so I'm not wrapping it with AuthContextProvider
 */
const renderComponent = async () => {
  await waitFor(() => {
    render(
      <MemoryRouter>
        <CartContextProvider>
          <CartBannerItem />
        </CartContextProvider>
      </MemoryRouter>
    );
  });
};

describe("CartBannerItem", () => {
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
      totalQuantity: 9,
    });

    await renderComponent();
  });
  test("renders without crashing", () => {
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("displays the correct number of items in the cart", async () => {
    expect(screen.getByText("9 Cart")).toBeInTheDocument();
  });

  test("navigates to the cart page when clicked", async () => {
    const user = userEvent.setup();
    const cartButton = screen.getByRole("button");

    await user.click(cartButton);
    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });
});
