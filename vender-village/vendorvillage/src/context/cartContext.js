import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create the context
const CartContext = createContext();

// Export a hook for easy access
export const useCart = () => useContext(CartContext);

// Provider component
const CartProvider = ({ userId, children }) => {
  const [cart, setCart] = useState({ userId, items: [] });
  const [loading, setLoading] = useState(true);

  // Fetch cart on userId change
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/cart/${userId}`)
        .then((res) => {
          setCart(res.data || { userId, items: [] });
        })
        .catch((err) => {
          console.error("Error loading cart:", err);
          toast.error("Failed to load cart.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await axios.post("http://localhost:5000/api/cart/add", {
        userId,
        productId,
        quantity,
      });
      setCart(res.data);
      toast.success("Item added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add item to cart.");
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete("http://localhost:5000/api/cart/remove", {
        data: { userId, productId },
      });
      setCart(res.data);
      toast.info("Item removed from cart.");
    } catch (err) {
      console.error("Error removing from cart:", err);
      toast.error("Failed to remove item.");
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/clear/${userId}`);
      setCart({ userId, items: [] });
      toast.warn("Cart cleared.");
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error("Failed to clear cart.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
