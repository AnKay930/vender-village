import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  useAuth,
  useUser,
} from "@clerk/clerk-react";

import AdminPage from "./pages/AdminPage";
import CustomerPage from "./pages/CustomerPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import "bootstrap/dist/css/bootstrap.min.css";
import AddUser from "./pages/AddUser";
import ViewUsers from "./pages/ViewUser";
import RolesPermissions from "./pages/RolePermissions";
import VendorDashboard from "./pages/VendorDashboard";
import CartProvider from "./context/cartContext";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import ProductDetail from "./pages/ProductDetail";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const clerkFrontendApi = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkFrontendApi || !clerkFrontendApi.startsWith("pk_")) {
  throw new Error(
    "Missing or invalid Clerk Publishable Key. Check your .env file."
  );
}

const VendorDashboardWrapper = () => {
  const { userId } = useAuth();
  return (
    <ProtectedRoute allowedRoles={["vendor"]}>
      <VendorDashboard vendorId={userId} />
    </ProtectedRoute>
  );
};

const AppRoutes = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const userId = user?.id;
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (isSignedIn && userId) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/users/get-user-role?userId=${userId}`
          );
          const data = await response.json();
          setUserRole(data.role);
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      }
    };
    fetchUserRole();
  }, [isSignedIn, userId]);

  if (!isLoaded) return null;

  return userRole === "customer" ? (
    <CartProvider userId={userId}>
      <>
        <Header userRole="customer" />
        <Routes>
          <Route path="/" element={<Homepage />} /> {/* Added */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/view-users" element={<ViewUsers />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/roles-permissions" element={<RolesPermissions />} />
          <Route path="/vendor" element={<VendorDashboardWrapper />} />
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-history"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    </CartProvider>
  ) : (
    <>
      <Header userRole={userRole} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/view-users" element={<ViewUsers />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/roles-permissions" element={<RolesPermissions />} />
        <Route path="/vendor" element={<VendorDashboardWrapper />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <Router>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      </Router>
    </ClerkProvider>
  );
};

export default App;
