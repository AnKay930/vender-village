import React, { useState, useEffect } from "react";
import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const RoleSelectionModal = ({ show, onClose }) => {
  const { user, isSignedIn } = useUser();
  const { redirectToSignUp } = useClerk();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      checkAndStoreUser(user);
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (sessionStorage.getItem("showAlert") === "true") {
      setShowAlert(true);
      setTimeout(() => {
        sessionStorage.removeItem("showAlert");
        setShowAlert(false);
      }, 3000);
    }
  }, []);

  const handleSignUp = (e) => {
    e.preventDefault();
    localStorage.setItem("selectedRole", role);
    redirectToSignUp();
  };

  const checkAndStoreUser = async (user) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/get-user-role?userId=${user.id}`
      );
      const data = await response.json();

      if (!data.role) {
        await storeUserInMongo(user);
      }
    } catch (error) {}
  };

  const storeUserInMongo = async (user) => {
    const role = localStorage.getItem("selectedRole") || "customer";

    try {
      await fetch("http://localhost:5000/api/users/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.primaryEmailAddress.emailAddress,
          role: role,
        }),
      });

      localStorage.removeItem("selectedRole");
      sessionStorage.setItem("showAlert", "true");

      await signOut();

      setTimeout(() => {
        navigate("/sign-in");
      }, 3000);
    } catch (error) {}
  };

  return (
    <>
      {showAlert && (
        <div
          className="alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3"
          role="alert"
        >
          Successfully Signed Up! Login to continue.
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}

      {show && <div className="modal-backdrop fade show"></div>}

      <div
        className={`modal fade ${show ? "show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Select Your Role</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSignUp}>
                <div className="mb-3">
                  <label>Role</label>
                  <select
                    className="form-control"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Continue to Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleSelectionModal;
