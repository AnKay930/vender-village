import React from "react";
import { Table, Button, Card } from "react-bootstrap";
import "../styles/VendorDashboard.css";

const ProductTable = ({ products, onEditClick, onDeleteClick }) => {
  const isMobileView = window.innerWidth <= 768;

  if (isMobileView) {
    return (
      <div className="product-cards-container">
        {products.length === 0 ? (
          <p className="text-center">No products found</p>
        ) : (
          products.map((product) => (
            <Card key={product._id} className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title className="fw-bold">{product.name}</Card.Title>
                <Card.Text>
                  <strong>Category:</strong> {product.category}
                  <br />
                  <strong>Brand:</strong> {product.brand}
                  <br />
                  <strong>Price:</strong> ${product.price}
                  <br />
                  <strong>Stock:</strong> {product.stock}
                </Card.Text>
                <div className="d-flex justify-content-between mt-3">
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={() => onEditClick(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDeleteClick(product._id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    );
  }

  // Desktop Table Layout
  return (
    <Table striped bordered hover className="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center">
              No products found
            </td>
          </tr>
        ) : (
          products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <Button
                  variant="primary"
                  className="me-2"
                  onClick={() => onEditClick(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDeleteClick(product._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default ProductTable;
