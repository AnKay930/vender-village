import React, { useEffect, useState } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminSidebar from "../components/AdminSidebar";
import { API_BASE } from "../config";

const RolesPermissions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedRoles, setUpdatedRoles] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/all-users`);
      const data = await res.json();
      setUsers(data);
      setUpdatedRoles(
        data.reduce((acc, user) => ({ ...acc, [user.userId]: user.role }), {})
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setUpdatedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const updateUserRole = async (userId) => {
    const newRole = updatedRoles[userId];

    try {
      const response = await fetch(`${API_BASE}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.userId === userId ? { ...user, role: newRole } : user
          )
        );
        setAlertMessage(`User role updated successfully to ${newRole}.`);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        console.error("Error updating role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className='d-flex'>
      <AdminSidebar />
      <div className='container-fluid p-4'>
        <h2>Roles & Permissions</h2>

        {showAlert && (
          <Alert
            variant='success'
            dismissible
            onClose={() => setShowAlert(false)}
          >
            {alertMessage}
          </Alert>
        )}

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Change Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <select
                      className='form-control'
                      value={updatedRoles[user.userId]}
                      onChange={(e) =>
                        handleRoleChange(user.userId, e.target.value)
                      }
                    >
                      <option value='customer'>Customer</option>
                      <option value='vendor'>Vendor</option>
                      <option value='admin'>Admin</option>
                    </select>
                  </td>
                  <td>
                    <Button
                      variant='primary'
                      size='sm'
                      onClick={() => updateUserRole(user.userId)}
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default RolesPermissions;
