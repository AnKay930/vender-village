import React from "react";
import "../styles/Filters.css";

const Filters = ({ filters, onChange, maxPrice }) => {
  const toggleCategory = (category) => {
    const updated = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onChange({ categories: updated });
  };

  return (
    <div className="filters">
      <h3>Filters</h3>

      {/* Category Filter */}
      <strong>Category</strong>
      {["T-shirts", "Shoes", "Caps", "Sunglasses", "Watches"].map(
        (category) => (
          <label key={category}>
            <input
              type="checkbox"
              checked={filters.categories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
            {category}
          </label>
        )
      )}

      {/* Price Range Filter */}
      <div style={{ marginTop: "20px" }}>
        <strong>Price Range</strong>
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={filters.price || 0}
          onChange={(e) => onChange({ price: Number(e.target.value) })}
        />
        <div>Up to ${filters.price || 0}</div>
      </div>

      {/* Review Filter */}
      <div style={{ marginTop: "20px" }}>
        <strong>Reviews</strong>
        {[4, 3, 0].map((rating) => (
          <label key={rating}>
            <input
              type="radio"
              name="reviews"
              checked={filters.reviews === rating}
              onChange={() => onChange({ reviews: rating })}
            />
            {rating === 0 ? "All Ratings" : `${rating} Stars & Up`}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filters;
