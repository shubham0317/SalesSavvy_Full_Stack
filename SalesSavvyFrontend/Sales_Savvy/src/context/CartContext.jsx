/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  fetchCartCount as apiFetchCartCount,
  fetchCartItems as apiFetchCartItems,
  addToCart as apiAddToCart,
  updateCartQuantity as apiUpdateCartQuantity,
  removeCartItem as apiRemoveCartItem,
} from "../services/cartApi";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { username, isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshCartCount = useCallback(async () => {
    if (!username) return;
    try {
      const res = await apiFetchCartCount(username);
      if (res.ok) {
        if (typeof res.data === "number") {
          setCartCount(res.data);
        } else if (res.data && typeof res.data.count === "number") {
          setCartCount(res.data.count);
        }
      }
    } catch (err) {
      console.error("Failed to fetch cart count:", err);
    }
  }, [username]);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetchCartItems();
      if (res.ok) {
        const products = res.data?.cart?.products || [];
        setCartItems(products);
      } else {
        setError(res.error || "Failed to load cart.");
      }
    } catch {
      setError("Unable to load cart items.");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(
    async (productId) => {
      try {
        const res = await apiRemoveCartItem(username, productId);
        if (res.ok) {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.product_id !== productId)
          );
          await refreshCartCount();
          return { success: true };
        } else {
          return { success: false, error: res.error || "Failed to remove item." };
        }
      } catch {
        return { success: false, error: "Unable to remove item." };
      }
    },
    [username, refreshCartCount]
  );

  const addItemToCart = useCallback(
    async (productId) => {
      if (!username) {
        return { success: false, error: "Please login first." };
      }
      try {
        const res = await apiAddToCart(username, productId);
        if (res.ok) {
          await refreshCartCount();
          return { success: true, message: "Product added to cart!" };
        } else {
          return { success: false, error: res.error || "Failed to add product to cart." };
        }
      } catch {
        return { success: false, error: "Unable to add product to cart." };
      }
    },
    [username, refreshCartCount]
  );

  const changeQuantity = useCallback(
    async (productId, newQuantity) => {
      if (newQuantity <= 0) {
        return removeItem(productId);
      }
      try {
        const res = await apiUpdateCartQuantity(username, productId, newQuantity);
        if (res.ok) {
          setCartItems((prevItems) =>
            prevItems.map((item) => {
              if (item.product_id === productId) {
                const newTotal = Number(item.price_per_unit) * newQuantity;
                return { ...item, quantity: newQuantity, total_price: newTotal };
              }
              return item;
            })
          );
          await refreshCartCount();
          return { success: true };
        } else {
          return { success: false, error: res.error || "Failed to update quantity." };
        }
      } catch {
        return { success: false, error: "Unable to update quantity." };
      }
    },
    [username, refreshCartCount, removeItem]
  );

  useEffect(() => {
    let isSubscribed = true;

    async function syncCartState() {
      if (isAuthenticated && username) {
        try {
          const res = await apiFetchCartCount(username);
          if (isSubscribed && res.ok) {
            if (typeof res.data === "number") {
              setCartCount(res.data);
            } else if (res.data && typeof res.data.count === "number") {
              setCartCount(res.data.count);
            }
          }
        } catch {
          // ignore
        }
      } else {
        if (isSubscribed) {
          setCartCount(0);
          setCartItems([]);
        }
      }
    }

    syncCartState();

    return () => {
      isSubscribed = false;
    };
  }, [isAuthenticated, username]);

  const value = {
    cartCount,
    cartItems,
    loading,
    error,
    refreshCartCount,
    loadCart,
    addItemToCart,
    changeQuantity,
    removeItem,
    setCartItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { useCart } from "../hooks/useCart";
