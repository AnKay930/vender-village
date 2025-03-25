import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCog, FaUsers, FaClipboardList } from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-light vh-100"
      style={{ width: "250px" }}
    >
      <h4 className="d-flex align-items-center mb-3">
        <FaUserCog className="me-2" /> Vendor Village Admin
      </h4>
      <hr />

      <ul className="nav flex-column">
        <li className="nav-item">
          <strong className="text-muted">User Management</strong>
          <ul className="nav flex-column ms-3">
            <li>
              <Link to="/view-users" className="nav-link text-dark">
                <FaUsers className="me-2" /> View Users
              </Link>
            </li>
            <li>
              <Link to="/add-user" className="nav-link text-dark">
                <FaUsers className="me-2" /> Add User
              </Link>
            </li>
            <li>
              <Link to="/roles-permissions" className="nav-link text-dark">
                <FaUsers className="me-2" /> Roles & Permissions
              </Link>
            </li>
          </ul>
        </li>

        <hr />

        <li className="nav-item">
          <strong className="text-muted">Content Moderation</strong>
          <ul className="nav flex-column ms-3">
            <li>
              <Link to="/admin/pending-reviews" className="nav-link text-dark">
                <FaClipboardList className="me-2" /> Pending Reviews
              </Link>
            </li>
            <li>
              <Link to="/admin/approved-content" className="nav-link text-dark">
                <FaClipboardList className="me-2" /> Approved Content
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
