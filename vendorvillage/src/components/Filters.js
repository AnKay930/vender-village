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
    <div className='filters'>
      <h3>Filters</h3>

      <strong>Category</strong>
      <label>
        <input
          type='checkbox'
          checked={filters.categories.includes("T-shirts")}
          onChange={() => toggleCategory("T-shirts")}
        />
        T-shirts
      </label>
      <label>
        <input
          type='checkbox'
          checked={filters.categories.includes("Shoes")}
          onChange={() => toggleCategory("Shoes")}
        />
        Shoes
      </label>
      <label>
        <input
          type='checkbox'
          checked={filters.categories.includes("Caps")}
          onChange={() => toggleCategory("Caps")}
        />
        Caps
      </label>
      <label>
        <input
          type='checkbox'
          checked={filters.categories.includes("Sunglasses")}
          onChange={() => toggleCategory("Sunglasses")}
        />
        Sunglasses
      </label>
      <label>
        <input
          type='checkbox'
          checked={filters.categories.includes("Watches")}
          onChange={() => toggleCategory("Watches")}
        />
        Watches
      </label>

      <div style={{ marginTop: "20px" }}>
        <strong>Price Range</strong>
        <input
          type='range'
          min='0'
          max={maxPrice}
          value={filters.price}
          onChange={(e) => onChange({ price: Number(e.target.value) })}
        />
        <div>Up to ${filters.price}</div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <strong>Reviews</strong>
        <label>
          <input
            type='radio'
            name='reviews'
            checked={filters.reviews === 4}
            onChange={() => onChange({ reviews: 4 })}
          />
          4 Stars & Up
        </label>
        <label>
          <input
            type='radio'
            name='reviews'
            checked={filters.reviews === 3}
            onChange={() => onChange({ reviews: 3 })}
          />
          3 Stars & Up
        </label>
        <label>
          <input
            type='radio'
            name='reviews'
            checked={filters.reviews === 0}
            onChange={() => onChange({ reviews: 0 })}
          />
          All Ratings
        </label>
      </div>
    </div>
  );
};

export default Filters;
