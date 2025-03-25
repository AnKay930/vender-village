import React from "react";
import { Table, Button } from "react-bootstrap";

const ProductTable = ({ products, onEditClick, onDeleteClick }) => {
  return (
    <Table striped bordered hover>
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
            <td colSpan="6" className="text-center">No products found</td>
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
                <Button variant="primary" className="me-2" onClick={() => onEditClick(product)}>Edit</Button>
                <Button variant="danger" onClick={() => onDeleteClick(product._id)}>Delete</Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default ProductTable;
