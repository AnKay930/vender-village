import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
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
    <div className="mb-4">
      <Form>
        {/* Search Input Group with Icon */}
        <Form.Group controlId="search" className="mb-3">
          <Form.Label className="sr-only">Search Products</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch style={{ color: "#999", fontSize: "1.2rem" }} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </InputGroup>
        </Form.Group>

        {/* Category Filter */}
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="All">All</option>
            <option value="Shoes">Shoes</option>
            <option value="Watches">Watches</option>
            <option value="T-Shirts">T-Shirts</option>
          </Form.Control>
        </Form.Group>
      </Form>
    </div>
  );
};

export default SearchAndFilter;
