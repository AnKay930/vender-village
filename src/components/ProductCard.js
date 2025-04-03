import React from "react";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className='product-card'>
      <img src={product.image} alt={product.name} className='product-image' />
      <div className='product-name'>
        <strong>{product.name}</strong>
      </div>
      <div className='product-price'>${product.price.toFixed(2)}</div>
      <button className='add-to-cart'>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
