import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cartContext";
import ProductReviewForm from "../components/ProductReviewForm";
import ProductReviews from "../components/ProductReviews";
import "../styles/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/`);
        const allProducts = res.data;
        const foundProduct = allProducts.find((p) => p._id === id);
        setProduct(foundProduct);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <p className="text-center mt-5">Loading product...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row g-4 align-items-center">
        {/* Image Section */}
        <div className="col-lg-6 col-md-6 col-12">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded shadow w-100"
          />
        </div>

        {/* Details Section */}
        <div className="col-lg-6 col-md-6 col-12">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted">
            {product.category} | {product.brand}
          </p>
          <h3 className="text-success">${product.price}</h3>

          <p className="mb-2">
            Average Rating: {product.rating.toFixed(1)} ★ ({product.numReviews} Reviews)
          </p>

          <p>{product.description}</p>

          <button
            className="btn btn-dark mt-3"
            onClick={() => {
              addToCart(product._id);
              navigate("/cart");
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-5">
        <ProductReviewForm
          productId={product._id}
          onReviewAdded={() => window.location.reload()}
        />
        <ProductReviews productId={product._id} />
      </div>
    </div>
  );
};

export default ProductDetail;
