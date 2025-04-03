import React from "react";
import AdminSidebar from "../components/AdminSidebar";

const AdminPage = () => {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="container-fluid p-4">
        <h1>Admin Dashboard</h1>
        <p>Welcome, Admin!</p>
      </div>
    </div>
  );
};

export default AdminPage;
