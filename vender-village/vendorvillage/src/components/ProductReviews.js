import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${productId}/reviews`);
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div className="mt-4">
      <h4>Reviews:</h4>

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="border rounded p-2 mb-2">
            <strong>{review.userName}</strong> rated {review.rating} ★
            <p>{review.comment}</p>
            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductReviews;
