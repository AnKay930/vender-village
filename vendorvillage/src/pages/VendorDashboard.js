import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import AddProductForm from "../components/AddProductForm";
import ProductModal from "../components/ProductModal";
import ProductTable from "../components/ProductTable";
import AlertMessage from "../components/AlertMessage";
import Loader from "../components/Loader";
import SearchAndFilter from "../components/SearchAndFilter";
import "../styles/VendorDashboard.css";

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
    if (vendorId) {
      fetchProducts();
    }
  }, [vendorId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`http://localhost:5000/api/vendor/vendor-products/${vendorId}`);
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data); // Set filtered products initially to all products
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/vendor/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct, vendorId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add product");
      }

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
      console.error("Error adding product:", err);
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/vendor/delete-product/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct({
      _id: product._id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      image: product.image || "",
      category: product.category || "",
      brand: product.brand || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/vendor/update-product/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update product");
      }

      fetchProducts();
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.message);
    }
  };

  const handleSearchAndFilter = (searchQuery, filterCategory) => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory && filterCategory !== "All") {
      filtered = filtered.filter(product =>
        product.category === filterCategory
      );
    }

    setFilteredProducts(filtered);
  };

  if (!vendorId) {
    return <AlertMessage message="User ID not available. Please sign in again." variant="warning" />;
  }

  return (
    <div className="container mt-4">
      <div className="dashboard-header">
        <h2>Vendor Dashboard</h2>
        <SearchAndFilter onSearchAndFilter={handleSearchAndFilter} />
      </div>

      <Button onClick={() => setShowModal(true)}>Add Product</Button>

      {error && <AlertMessage message={error} variant="danger" />}

      {loading ? (
        <Loader />
      ) : (
        <ProductTable
          products={filteredProducts}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteProduct}
        />
      )}

      {/* Add Product Modal */}
      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Add Product"
        formContent={<AddProductForm product={newProduct} onChange={(field, value) => setNewProduct({ ...newProduct, [field]: value })} />}
        onSubmit={handleAddProduct}
      />

      {/* Edit Product Modal */}
      <ProductModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        title="Edit Product"
        formContent={<AddProductForm product={editingProduct} onChange={(field, value) => setEditingProduct({ ...editingProduct, [field]: value })} />}
        onSubmit={handleUpdateProduct}
      />
    </div>
  );
};

export default VendorDashboard;