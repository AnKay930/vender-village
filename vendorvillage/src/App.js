import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ClerkProvider, SignIn, SignUp } from "@clerk/clerk-react";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import VendorPage from "./pages/VendorPage";
import CustomerPage from "./pages/CustomerPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";

const clerkFrontendApi = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkFrontendApi || !clerkFrontendApi.startsWith("pk_")) {
  throw new Error(
    "Missing or invalid Clerk Publishable Key. Check your .env file."
  );
}

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
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
          <Route
            path="/vendor"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
};

export default App;
