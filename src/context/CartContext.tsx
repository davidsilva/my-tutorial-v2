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
import { AsyncProcessStatus, CartItemsAsyncProcess } from "../types";

const client = generateClient();

type CartContextProviderProps = {
  children: React.ReactNode;
  initialState?: CartItem[];
};

export type CartContextType = {
  cartItemsProcess: CartItemsAsyncProcess;
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
}) => {
  const [cartItemsProcess, setCartItemsProcess] =
    useState<CartItemsAsyncProcess>({
      status: AsyncProcessStatus.NONE,
    });
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const { authState } = useAuthContext();

  const fetchCartItems = useCallback(async () => {
    const sessionId = authState?.sessionId;
    setCartItemsProcess({ status: AsyncProcessStatus.PENDING });
    console.log("fetchCartItems sessionId", sessionId);
    console.log("fetchCartItems authState", authState);

    try {
      const response = await client.graphql({
        query: listCartItemsWithProduct,
        authMode: authState?.isLoggedIn ? "userPool" : "iam",
        variables: {
          filter: { sessionId: { eq: sessionId } },
          limit: 1000,
        },
      });

      console.log("fetchCartItems response", response);

      if ("data" in response) {
        const data = response.data as ListCartItemsQuery;
        console.log("data", data);
        const cartItems = data.listCartItems?.items || [];
        const nonNullCartItems = cartItems.filter(Boolean) as CartItem[];
        console.log("cartItems", cartItems);
        console.log("nonNullCartItems", nonNullCartItems);
        setCartItemsProcess({
          status: AsyncProcessStatus.SUCCESS,
          value: { items: nonNullCartItems },
        });
      }
    } catch (err) {
      console.error("error fetching cart items: ", err);
      setCartItemsProcess({
        status: AsyncProcessStatus.ERROR,
        error: { message: "error fetching cart items" },
        value: { items: [] },
      });
    }
  }, [authState]);

  useEffect(() => {
    console.log("useEffect fetchCartItems authState", authState);
    if (authState?.isAuthStateKnown && authState?.sessionId) {
      fetchCartItems();
    }
  }, [authState, fetchCartItems]);

  useEffect(() => {
    if (cartItemsProcess.status === AsyncProcessStatus.SUCCESS) {
      const newTotalAmount = cartItemsProcess.value.items.reduce(
        (acc, cartItem) =>
          cartItem.product
            ? acc + (cartItem.product.price * cartItem.quantity) / 100
            : acc,
        0
      );
      setTotalAmount(newTotalAmount);

      const newTotalQuantity = cartItemsProcess.value.items.reduce(
        (acc, cartItem) => acc + cartItem.quantity,
        0
      );
      setTotalQuantity(newTotalQuantity);
    }
  }, [cartItemsProcess]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    console.log("addToCart", product, quantity);
    if (cartItemsProcess.status !== AsyncProcessStatus.SUCCESS) {
      return;
    }

    const existingItem = cartItemsProcess.value.items.find(
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

      /* 
      The checking for whether there is a prev and prev.value is because the NONE status doesn't have a value. When adding an item, though, cartItems should be in SUCCESS or ERROR status. I'm not sure this interface makes sense. Or maybe there should just be a cartItems state variable and some other variable that reflects status?
      */
      setCartItemsProcess((prev) => ({
        status: AsyncProcessStatus.PENDING,
        value: {
          items:
            "value" in prev && prev.value
              ? [...prev.value.items, newItem]
              : [newItem],
        },
      }));

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

          setCartItemsProcess((prev) => ({
            status: AsyncProcessStatus.SUCCESS,
            value: {
              items:
                "value" in prev && prev.value
                  ? [...prev.value.items, newItem]
                  : [newItem],
            },
          }));
        }
      } catch (err) {
        console.error("error adding item to cart: ", err);
      }
    }
  };

  const removeFromCart = async (item: CartItem) => {
    setCartItemsProcess((prev) => {
      if ("value" in prev && prev.value) {
        const newItems = prev.value.items.filter(
          (cartItem) => cartItem.id !== item.id
        );
        return {
          status: AsyncProcessStatus.SUCCESS,
          value: { items: newItems },
        };
      }
      return prev;
    });

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

      setCartItemsProcess((prev) => {
        if ("value" in prev && prev.value) {
          const newItems = prev.value.items.filter(
            (cartItem) => cartItem.id !== item.id
          );
          return {
            status: AsyncProcessStatus.SUCCESS,
            value: { items: newItems },
          };
        }
        return prev;
      });
    } catch (err) {
      console.error("error removing item from cart: ", err);

      setCartItemsProcess((prev) => {
        if ("value" in prev && prev.value) {
          const newItems = prev.value.items.filter(
            (cartItem) => cartItem.id !== item.id
          );
          return {
            status: AsyncProcessStatus.ERROR,
            error: { message: "error removing item from cart" },
            value: { items: newItems },
          };
        }
        return prev;
      });
    }
  };

  /* 
  Later we should use a custom mutation to delete all cart items with a given sessionId in a single call.
   */
  const clearCart = async () => {
    if (!authState?.sessionId) {
      throw new Error("sessionId is required to clear cart");
    }

    if ("value" in cartItemsProcess && cartItemsProcess.value) {
      for (const item of cartItemsProcess.value.items) {
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
      }
    }

    setCartItemsProcess({
      status: AsyncProcessStatus.SUCCESS,
      value: { items: [] },
    });
  };

  const incrementQuantity = async (item: CartItem, increment: number = 1) => {
    const newQuantity = item.quantity + increment;

    let newCartItems: CartItem[] = [];
    if ("value" in cartItemsProcess && cartItemsProcess.value) {
      newCartItems = cartItemsProcess.value.items.map((cartItem) => {
        if (cartItem.id === item.id) {
          return {
            ...cartItem,
            quantity: newQuantity,
          };
        }
        return cartItem;
      });
    }
    setCartItemsProcess({
      status: AsyncProcessStatus.PENDING,
      value: { items: newCartItems },
    });

    if (!authState?.sessionId) {
      throw new Error("sessionId is required to update items in cart");
    }

    const variables: UpdateCartItemMutationVariables = {
      input: {
        id: item.id,
        quantity: newQuantity,
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
      let newCartItems: CartItem[] = [];
      if ("value" in cartItemsProcess && cartItemsProcess.value) {
        newCartItems = cartItemsProcess.value.items.map((cartItem) => {
          if (cartItem.id === item.id) {
            return {
              ...cartItem,
              quantity: cartItem.quantity - decrement,
            };
          }
          return cartItem;
        });
      }
      setCartItemsProcess({
        status: AsyncProcessStatus.SUCCESS,
        value: { items: newCartItems },
      });

      if (!authState?.sessionId) {
        throw new Error("sessionId is required to update items in cart");
      }

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
        cartItemsProcess: cartItemsProcess,
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
