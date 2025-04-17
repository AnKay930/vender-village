import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const ProductReviewForm = ({ productId, onReviewAdded }) => {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewId, setReviewId] = useState(null); // used for editing

  const fetchUserReview = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${productId}/reviews`);
      const existingReview = res.data.find((rev) => rev.userId === user.id);
      if (existingReview) {
        setRating(existingReview.rating);
        setComment(existingReview.comment);
        setReviewId(existingReview._id);
      }
    } catch (err) {
      console.error("Error loading user's review:", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserReview();
    }
  }, [user?.id, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      return toast.error("Please select a rating.");
    }

    try {
      if (reviewId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${productId}/review/${reviewId}`, {
          rating,
          comment,
        });
        toast.success("Review updated!");
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/products/${productId}/review`, {
          userId: user.id,
          userName: user.fullName,
          rating,
          comment,
        });
        toast.success("Review submitted!");
      }

      onReviewAdded();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4 className="mb-2">{reviewId ? "Edit Your Review" : "Add a Review"}</h4>

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
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="form-control mb-2"
        placeholder="Write your review"
        rows="3"
      />

      <button className="btn btn-dark" type="submit">
        {reviewId ? "Update Review" : "Submit Review"}
      </button>
    </form>
  );
};

export default ProductReviewForm;
