import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ProductModal = ({ show, onHide, title, formContent, onSubmit }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>{formContent}</Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={onSubmit}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
