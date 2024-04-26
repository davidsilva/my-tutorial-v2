import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  CreateCartItemMutationVariables,
  DeleteCartItemMutationVariables,
  Product,
  UpdateCartItemMutationVariables,
  CartItem,
} from "../API";
import { ListCartItemsQuery } from "../API";
import {
  createCartItem,
  deleteCartItem,
  updateCartItem,
} from "../graphql/mutations";
import { listCartItemsWithProduct } from "../graphql/customQueries";
import { generateClient } from "aws-amplify/api";
import { useAuthContext } from "./AuthContext";

const client = generateClient();

type CartContextProviderProps = {
  children: React.ReactNode;
  initialState?: CartItem[];
};

export type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  incrementQuantity: (item: CartItem) => void;
  decrementQuantity: (item: CartItem) => void;
  totalAmount: number;
  totalQuantity: number;
  fetchCartItems: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartContextProvider: React.FC<CartContextProviderProps> = ({
  children,
  initialState,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialState || []);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const { authState } = useAuthContext();

  const fetchCartItems = useCallback(async () => {
    const sessionId = authState?.sessionId;
    try {
      const response = await client.graphql({
        query: listCartItemsWithProduct,
        authMode: authState?.isLoggedIn ? "userPool" : "iam",
        variables: {
          filter: { sessionId: { eq: sessionId } },
          limit: 1000,
        },
      });

      if ("data" in response) {
        const data = response.data as ListCartItemsQuery;
        console.log("data", data);
        const cartItems = data.listCartItems?.items || [];
        const nonNullCartItems = cartItems.filter(Boolean) as CartItem[];
        console.log("cartItems", cartItems);
        setCartItems(nonNullCartItems);
      }
    } catch (err) {
      console.error("error fetching cart items: ", err);
    }
  }, [authState?.isLoggedIn, authState?.sessionId]);

  useEffect(() => {
    if (authState?.isAuthStateKnown && authState?.sessionId) {
      fetchCartItems();
    }
  }, [authState?.isAuthStateKnown, authState?.sessionId, fetchCartItems]);

  useEffect(() => {
    const newTotalAmount = cartItems.reduce(
      (acc, cartItem) =>
        cartItem.product
          ? acc + (cartItem.product.price * cartItem.quantity) / 100
          : acc,
      0
    );
    setTotalAmount(newTotalAmount);

    const newTotalQuantity = cartItems.reduce(
      (acc, cartItem) => acc + cartItem.quantity,
      0
    );
    setTotalQuantity(newTotalQuantity);
  }, [cartItems]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    console.log("addToCart", product, quantity);
    const existingItem = cartItems.find(
      (cartItem) => cartItem.productId === product.id
    );
    if (existingItem) {
      incrementQuantity(existingItem, quantity);
    } else {
      if (!authState?.sessionId) {
        throw new Error("sessionId is required to add items to cart");
      }

      const newItem: CartItem = {
        __typename: "CartItem",
        id: "",
        sessionId: authState?.sessionId,
        productId: product.id,
        quantity,
        createdAt: "",
        updatedAt: "",
        productCartItemsId: null,
        sessionCartItemsId: null,
      };

      console.log("new item to add to cart", newItem);

      const variables: CreateCartItemMutationVariables = {
        input: {
          productId: product.id,
          quantity,
          sessionId: authState?.sessionId,
        },
      };

      try {
        const response = await client.graphql({
          query: createCartItem,
          authMode: authState?.isLoggedIn ? "userPool" : "iam",
          variables,
        });
        if ("data" in response && response.data?.createCartItem) {
          newItem.id = response.data.createCartItem.id;
          newItem.createdAt = response.data.createCartItem.createdAt;
          newItem.updatedAt = response.data.createCartItem.updatedAt;

          console.log("newItem", newItem);

          setCartItems((prevItems) => [...prevItems, newItem]);
        }
      } catch (err) {
        console.error("error adding item to cart: ", err);
      }
    }
  };

  const removeFromCart = async (item: CartItem) => {
    const newCartItems = cartItems.filter(
      (cartItem) => cartItem.id !== item.id
    );
    setCartItems(newCartItems);

    const variables: DeleteCartItemMutationVariables = {
      input: {
        id: item.id,
      },
    };

    try {
      await client.graphql({
        query: deleteCartItem,
        authMode: authState?.isLoggedIn ? "userPool" : "iam",
        variables,
      });
    } catch (err) {
      console.error("error removing item from cart: ", err);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const incrementQuantity = async (item: CartItem, increment: number = 1) => {
    const newCartItems = cartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        return {
          ...cartItem,
          quantity: cartItem.quantity + increment,
        };
      }
      return cartItem;
    });
    setCartItems(newCartItems);

    if (!authState?.sessionId) {
      throw new Error("sessionId is required to add items to cart");
    }

    const variables: UpdateCartItemMutationVariables = {
      input: {
        id: item.id,
        quantity: item.quantity + increment,
      },
    };

    try {
      await client.graphql({
        query: updateCartItem,
        authMode: authState?.isLoggedIn ? "userPool" : "iam",
        variables,
      });
    } catch (err) {
      console.error("error updating item quantity: ", err);
    }
  };

  const decrementQuantity = (item: CartItem, decrement: number = 1) => {
    if (item.quantity - decrement <= 0) {
      removeFromCart(item);
    } else {
      const newCartItems = cartItems.map((cartItem) => {
        if (cartItem.id === item.id) {
          return {
            ...cartItem,
            quantity: cartItem.quantity - decrement,
          };
        }
        return cartItem;
      });
      setCartItems(newCartItems);

      const variables: UpdateCartItemMutationVariables = {
        input: {
          id: item.id,
          quantity: item.quantity - decrement,
        },
      };

      try {
        client.graphql({
          query: updateCartItem,
          authMode: authState?.isLoggedIn ? "userPool" : "iam",
          variables,
        });
      } catch (err) {
        console.error("error updating item quantity: ", err);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        incrementQuantity,
        decrementQuantity,
        totalAmount,
        totalQuantity,
        fetchCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within CartContextProvider");
  }

  return context;
};
