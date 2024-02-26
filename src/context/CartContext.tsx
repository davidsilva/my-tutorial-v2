import React, { useState, useEffect, createContext, useContext } from "react";
import { Product } from "../API";

type CartContextProviderProps = {
  children: React.ReactNode;
  initialState?: CartItem[];
};

export type CartItem = Product & { quantity: number };

export type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  incrementQuantity: (item: CartItem) => void;
  decrementQuantity: (item: CartItem) => void;
  totalAmount: number;
  totalQuantity: number;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartContextProvider: React.FC<CartContextProviderProps> = ({
  children,
  initialState,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialState || []);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const newTotalAmount = cartItems.reduce(
      (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
      0
    );
    setTotalAmount(newTotalAmount);

    const newTotalQuantity = cartItems.reduce(
      (acc, cartItem) => acc + cartItem.quantity,
      0
    );
    setTotalQuantity(newTotalQuantity);
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.id === product.id
    );
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === product.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      );
    } else {
      const newItem = { ...product, quantity };
      setCartItems((prevItems) => [...prevItems, newItem]);
    }
  };

  const removeFromCart = (item: CartItem) => {
    const newCartItems = cartItems.filter(
      (cartItem) => cartItem.id !== item.id
    );
    setCartItems(newCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const incrementQuantity = (item: CartItem) => {
    const newCartItems = cartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        return {
          ...cartItem,
          quantity: cartItem.quantity + 1,
        };
      }
      return cartItem;
    });
    setCartItems(newCartItems);
  };

  const decrementQuantity = (item: CartItem) => {
    const newCartItems = cartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        return {
          ...cartItem,
          quantity: cartItem.quantity > 1 ? cartItem.quantity - 1 : 0,
        };
      }
      return cartItem;
    });

    const filteredCartItems = newCartItems.filter(
      (cartItem) => cartItem.quantity > 0
    );
    console.log("filteredCartItems", filteredCartItems);

    setCartItems(filteredCartItems);
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
