import React, { useState, useEffect } from "react";
import {
  useUser,
  UserButton,
  SignOutButton,
  SignInButton,
} from "@clerk/clerk-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import RoleSelectionModal from "./RoleSelectionModal";

const Header = () => {
  const { isSignedIn, user } = useUser();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (isSignedIn && user && !userRole) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/users/get-user-role?userId=${user.id}`
          );
          const data = await response.json();
          setUserRole(data.role);

          const currentPath = location.pathname;
          if (data.role === "admin" && currentPath !== "/admin") {
            navigate("/admin");
          } else if (data.role === "vendor" && currentPath !== "/vendor") {
            navigate("/vendor");
          } else if (data.role === "customer" && currentPath !== "/customer") {
            navigate("/customer");
          }
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      }
    };

    fetchUserRole();
  }, [isSignedIn, user, userRole, navigate, location.pathname]);

  return (
    <header className="navbar navbar-light bg-light p-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <h1 className="navbar-brand mb-0">Vendor Village</h1>

        <nav className="d-flex justify-content-center flex-grow-1">
          {isSignedIn && userRole && (
            <>
              {userRole === "customer" && (
                <Link to="/customer" className="nav-link mx-2">
                  Customer Page
                </Link>
              )}
              {userRole === "vendor" && (
                <Link to="/vendor" className="nav-link mx-2">
                  Vendor Page
                </Link>
              )}
              {userRole === "admin" && (
                <Link to="/admin" className="nav-link mx-2">
                  Admin Page
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="d-flex align-items-center">
          {isSignedIn ? (
            <div className="dropdown">
              <UserButton />
              <ul className="dropdown-menu">
                <li>
                  <SignOutButton>
                    <button className="dropdown-item">Logout</button>
                  </SignOutButton>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="btn btn-primary me-2">Login</button>
              </SignInButton>
              <button
                className="btn btn-success"
                onClick={() => setShowSignUpModal(true)}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      <RoleSelectionModal
        show={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
      />
    </header>
  );
};

export default Header;
