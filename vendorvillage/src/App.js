import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ClerkProvider, SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import AdminPage from "./pages/AdminPage";
import CustomerPage from "./pages/CustomerPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import AddUser from "./pages/AddUser";
import ViewUsers from "./pages/ViewUser";
import RolesPermissions from "./pages/RolePermissions";
import VendorDashboard from "./pages/VendorDashboard";

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

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <Router>
        <Header />
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
                <AddUser />
                <ViewUsers />
                <RolesPermissions />
              </ProtectedRoute>
            }
          />
          
          {/* Replace the vendor route with VendorDashboard */}
          <Route path="/vendor" element={<VendorDashboardWrapper />} />
          
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
          <Route path="view-users" element={<ViewUsers />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="roles-permissions" element={<RolesPermissions />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
};

export default App;