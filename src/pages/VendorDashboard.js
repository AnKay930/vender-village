import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import AddProductForm from "../components/AddProductForm";
import ProductModal from "../components/ProductModal";
import ProductTable from "../components/ProductTable";
import AlertMessage from "../components/AlertMessage";
import Loader from "../components/Loader";
import SearchAndFilter from "../components/SearchAndFilter";
import "../styles/VendorDashboard.css";
import { API_BASE } from "../config";

const VendorDashboard = ({ vendorId }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: "",
    brand: "",
  });

  const [editingProduct, setEditingProduct] = useState({
    _id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: "",
    brand: "",
  });

  useEffect(() => {
    if (vendorId) fetchProducts();
  }, [vendorId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${API_BASE}/api/vendor/vendor-products/${vendorId}`
      );
      if (!res.ok) throw new Error("Failed to fetch products.");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/vendor/add-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct, vendorId }),
      });
      if (!res.ok) throw new Error("Failed to add product.");
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
        category: "",
        brand: "",
      });
      fetchProducts();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/vendor/delete-product/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete product.");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/vendor/update-product/${editingProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProduct),
        }
      );
      if (!res.ok) throw new Error("Failed to update product.");
      fetchProducts();
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleSearchAndFilter = (searchQuery, filterCategory) => {
    let filtered = products;
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterCategory && filterCategory !== "All") {
      filtered = filtered.filter((p) => p.category === filterCategory);
    }
    setFilteredProducts(filtered);
  };

  if (!vendorId) {
    return (
      <AlertMessage
        message='User ID not available. Please sign in again.'
        variant='warning'
      />
    );
  }

  return (
    <div className='container mt-4'>
      <div className='dashboard-header'>
        <h2>Vendor Dashboard</h2>
        <SearchAndFilter onSearchAndFilter={handleSearchAndFilter} />
      </div>

      <div className='mb-3'>
        <Button onClick={() => setShowModal(true)}>Add Product</Button>
      </div>

      {error && <AlertMessage message={error} variant='danger' />}

      {loading ? (
        <Loader />
      ) : (
        <ProductTable
          products={filteredProducts}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteProduct}
          isMobileView={window.innerWidth <= 768}
        />
      )}

      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title='Add Product'
        formContent={
          <AddProductForm
            product={newProduct}
            onChange={(field, value) =>
              setNewProduct({ ...newProduct, [field]: value })
            }
          />
        }
        onSubmit={handleAddProduct}
      />

      <ProductModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        title='Edit Product'
        formContent={
          <AddProductForm
            product={editingProduct}
            onChange={(field, value) =>
              setEditingProduct({ ...editingProduct, [field]: value })
            }
          />
        }
        onSubmit={handleUpdateProduct}
      />
    </div>
  );
};

export default VendorDashboard;
