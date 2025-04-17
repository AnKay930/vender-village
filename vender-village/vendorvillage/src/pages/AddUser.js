import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminSidebar from "../components/AdminSidebar";

const AddUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage("");
    setShowAlert(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/clerk/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("User added successfully!");
        setAlertVariant("success");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 3000);

        setEmail("");
        setPassword("");
        setRole("customer");
      } else {
        throw new Error(data.error || "Error adding user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setMessage(error.message || "An error occurred.");
      setAlertVariant("danger");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="container mt-4">
        <h2>Add User</h2>
        {showAlert && (
          <Alert
            variant={alertVariant}
            dismissible
            onClose={() => setShowAlert(false)}
          >
            {message}
          </Alert>
        )}
        <form onSubmit={handleAddUser}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding User..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
