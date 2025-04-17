import React, { useState, useEffect } from "react";
import {
  useUser,
  UserButton,
  SignOutButton,
  SignInButton,
} from "@clerk/clerk-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import RoleSelectionModal from "./RoleSelectionModal";
import { useCart } from "../context/cartContext";

const Header = () => {
  const { isSignedIn, user } = useUser();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const cartContext = useCart();
  const cart = cartContext?.cart || { items: [] };
  const cartItemCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  useEffect(() => {
    const fetchUserRole = async () => {
      if (isSignedIn && user && !userRole) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/users/get-user-role?userId=${user.id}`
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
    <header className="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-3">
      <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center">
        <Link to="/" className="navbar-brand fs-4 fw-bold text-primary mb-2 mb-lg-0">
          Vendor Village
        </Link>

        <nav className="d-flex flex-wrap justify-content-center align-items-center gap-3">
          {isSignedIn && userRole && (
            <>
              {userRole === "customer" && (
                <>
                  <Link to="/customer" className="nav-link fw-medium">
                    Products
                  </Link>
                  <Link to="/order-history" className="nav-link fw-medium">
                    Order History
                  </Link>
                </>
              )}
              {userRole === "vendor" && (
                <Link to="/vendor" className="nav-link fw-medium">
                  Vendor Page
                </Link>
              )}
              {userRole === "admin" && (
                <Link to="/admin" className="nav-link fw-medium">
                  Admin Page
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="d-flex align-items-center gap-3 mt-2 mt-lg-0">
          {isSignedIn && userRole === "customer" && (
            <Link to="/cart" className="position-relative text-dark me-2">
              <FaShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          {isSignedIn ? (
            <div className="d-flex align-items-center">
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
                <button className="btn btn-outline-primary">Login</button>
              </SignInButton>
              <button
                className="btn btn-primary"
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
