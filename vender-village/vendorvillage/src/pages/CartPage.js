import React from "react";
import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleRemove = (productId) => {
    removeFromCart(productId);
    toast.info("Item removed from cart.");
  };

  const handleClearCart = () => {
    clearCart();
    toast.warn("Cart cleared.");
  };

  const total = cart.items.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cart.items.map((item) => {
              const product = item.productId;
              const price = product?.price || 0;
              const name = product?.name || "Unknown Product";
              const image =
                product?.image || "https://via.placeholder.com/80";

              return (
                <li key={product?._id || Math.random()} className="cart-item">
                  <img src={image} alt={name} />
                  <div className="item-info">
                    <h4>{name}</h4>
                    <p>
                      ${price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(product?._id)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="cart-summary">
            <h4>Total: ${total.toFixed(2)}</h4>
            <div className="cart-actions">
              <button onClick={handleClearCart} className="clear-btn">
                Clear Cart
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="checkout-btn"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
