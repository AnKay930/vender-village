import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import "../styles/SearchAndFilter.css";

const SearchAndFilter = ({ onSearchAndFilter }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearchAndFilter(e.target.value, category);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    onSearchAndFilter(searchQuery, e.target.value);
  };

  return (
    <Form>
      <div className="search-filter-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="All">All</option>
            <option value="Shoes">Shoes</option>
            <option value="Watches">Watches</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Sunglasses">Sunglasses</option>
          </select>
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </div>
      </div>
    </Form>
  );
};

export default SearchAndFilter;