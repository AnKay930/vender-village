import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { API_BASE } from "../config";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const { user } = useUser();

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/products/${productId}/reviews`
      );
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div className='mt-4'>
      <h4>Reviews:</h4>

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review._id}
            className={`border rounded p-3 mb-3 ${
              user?.id === review.userId ? "border-primary" : ""
            }`}
          >
            <div className='d-flex justify-content-between'>
              <strong>{review.userName}</strong>
              <span className='text-warning'>{review.rating} ★</span>
            </div>
            <p className='mb-1'>{review.comment}</p>
            <small className='text-muted'>
              {new Date(review.createdAt).toLocaleDateString()}
            </small>
            {/* Optional: Highlight current user's review */}
            {user?.id === review.userId && (
              <span className='badge bg-primary ms-2'>Your Review</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ProductReviews;
