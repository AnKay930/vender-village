import React, { useEffect, useState } from "react";
import axios from "axios";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import "../styles/CustomerPage.css";

const CustomerPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    categories: [],
    price: null,
    reviews: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setAllProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    const filteredList = allProducts.filter((item) => {
      const matchCategory =
        updated.categories.length === 0 ||
        updated.categories.includes(item.category);
      const matchPrice = item.price <= updated.price;
      const matchReview = item.rating >= updated.reviews;
      return matchCategory && matchPrice && matchReview;
    });

    setFiltered(filteredList);
  };

  useEffect(() => {
    if (allProducts.length > 0) {
      const max = Math.max(...allProducts.map((p) => p.price));
      setFilters((prev) => ({ ...prev, price: max }));
    }
  }, [allProducts]);

  useEffect(() => {
    if (filters.price !== null && allProducts.length > 0) {
      handleFilterChange(filters);
    }
  }, [filters.price]);

  const maxPrice =
    allProducts.length > 0
      ? Math.max(...allProducts.map((p) => p.price))
      : 1000;

  return (
    <div className='customer-page'>
      <div className='filter-toggle'>
        <button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className='main-content'>
        <div className={`filter-wrapper ${showFilters ? "open" : "collapsed"}`}>
          <Filters
            filters={filters}
            onChange={handleFilterChange}
            maxPrice={maxPrice}
          />
        </div>

        <div className='products-section'>
          {loading ? (
            <p>Loading products...</p>
          ) : filtered.length > 0 ? (
            filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p>No products match the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
