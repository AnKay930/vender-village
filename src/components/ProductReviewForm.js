import React, { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const ProductReviewForm = ({ productId, onReviewAdded }) => {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      return toast.error("Please select a rating.");
    }

    try {
      await axios.post(`http://localhost:5000/api/products/${productId}/review`, {
        userId: user.id,
        userName: user.fullName,
        rating,
        comment,
      });

      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      onReviewAdded(); // Refetch reviews
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4 className="mb-2">Add a Review</h4>

      {/* Star Rating */}
      <div className="mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`mx-1 cursor-pointer ${star <= rating ? "text-warning" : ""}`}
            onClick={() => setRating(star)}
            role="button"
            style={{ fontSize: "20px" }}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        value={comment || ""}
        onChange={(e) => setComment(e.target.value)}
        className="form-control mb-2"
        placeholder="Write your review"
        rows="3"
      />

      <button className="btn btn-dark" type="submit">
        Submit Review
      </button>
    </form>
  );
};

export default ProductReviewForm;
