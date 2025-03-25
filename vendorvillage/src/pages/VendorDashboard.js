import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";

const VendorDashboard = ({ vendorId }) => {
  const [products, setProducts] = useState([]);
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
  });
  const [editingProduct, setEditingProduct] = useState({
    _id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    // Only fetch products if vendorId is available
    if (vendorId) {
      fetchProducts();
    }
  }, [vendorId]); // Add vendorId as a dependency

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

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
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
        method: "DELETE" 
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
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/vendor/update-product/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          price: editingProduct.price,
          stock: editingProduct.stock,
          name: editingProduct.name,
          description: editingProduct.description
        }),
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

  if (!vendorId) {
    return <Alert variant="warning">User ID not available. Please sign in again.</Alert>;
  }

  return (
    <div className="container mt-4">
      <h2>Vendor Dashboard</h2>
      <p>Vendor ID: {vendorId}</p>

      <Button onClick={() => setShowModal(true)}>Add Product</Button>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {loading ? (
        <p className="mt-3">Loading products...</p>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No products found</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <Button 
                      variant="primary" 
                      className="me-2" 
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* Add Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={editingProduct.stock}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateProduct}>
            Update Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VendorDashboard;