import React from "react";
import { Form } from "react-bootstrap";

const AddProductForm = ({ product, onChange }) => {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={product.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          value={product.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          value={product.price}
          onChange={(e) => onChange("price", e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Stock</Form.Label>
        <Form.Control
          type="number"
          value={product.stock}
          onChange={(e) => onChange("stock", e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          value={product.category}
          onChange={(e) => onChange("category", e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Brand</Form.Label>
        <Form.Control
          type="text"
          value={product.brand}
          onChange={(e) => onChange("brand", e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="text"
          value={product.image}
          onChange={(e) => onChange("image", e.target.value)}
          placeholder="Enter image URL"
        />
      </Form.Group>
    </>
  );
};

export default AddProductForm;
