import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import CustomerHomePage from "../Pages/CustomerHomePage";
import CartPage from "../Pages/CartPage";
import OrdersPage from "../Pages/OrdersPage";
import AdminDashboard from "../Pages/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Routes (Protected) */}
      <Route
        path="/customerhome"
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <CustomerHomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard (Protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;