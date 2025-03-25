import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import "../styles/CustomerPage.css";

const dummyProducts = [
  {
    id: 1,
    name: "Eco-friendly T-shirt",
    price: 25,
    category: "Clothing",
    rating: 4,
  },
  {
    id: 2,
    name: "Bamboo Sunglasses",
    price: 40,
    category: "Accessories",
    rating: 3.5,
  },
  { id: 3, name: "Denim Jacket", price: 60, category: "Clothing", rating: 4.5 },
  {
    id: 4,
    name: "Leather Belt",
    price: 30,
    category: "Accessories",
    rating: 2.8,
  },
];

const CustomerPage = () => {
  const [filters, setFilters] = useState({
    categories: [],
    price: 100,
    reviews: 0,
  });

  const handleFilterChange = (newPartial) => {
    setFilters((prev) => ({ ...prev, ...newPartial }));
  };

  const filteredProducts = dummyProducts.filter((item) => {
    const matchCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(item.category);
    const matchPrice = item.price <= filters.price;
    const matchReview = item.rating >= filters.reviews;
    return matchCategory && matchPrice && matchReview;
  });

  return (
    <div className='customer-page'>
      <Navbar />
      <div className='main-content'>
        <Filters filters={filters} onChange={handleFilterChange} />
        <div className='products-section'>
          {filteredProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
