import React from "react";
import "../styles/ProductCard.css";
import { useCart } from "../context/cartContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product._id); // Call context function with productId
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />

      <div className="product-name">
        <strong>{product.name}</strong>
      </div>

      <div className="product-price">${product.price.toFixed(2)}</div>

      {/* Rating */}
      <div className="product-rating">
        {product.rating.toFixed(1)} ★ ({product.numReviews} Reviews)
      </div>

      <div className="product-actions mt-2">
        <button className="add-to-cart" onClick={handleAddToCart}>
          Add to Cart
        </button>

        {/* View Details */}
        <Link to={`/product/${product._id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
