import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../Pages/Login";
import Register from "../Pages/Register";
import CustomerHomePage from "../Pages/CustomerHomePage";
import CartPage from "../Pages/CartPage";
import OrdersPage from "../Pages/OrdersPage";
import AdminDashboard from "../Pages/AdminDashboard";

function AppRoutes() {
    return (
        <Routes>

            {/* Default route */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* Authentication routes */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* Customer Home */}
            <Route
                path="/customerhome"
                element={<CustomerHomePage />}
            />

            {/* Cart */}
            <Route
                path="/cart"
                element={<CartPage />}
            />

            {/* Orders */}
            <Route
                path="/orders"
                element={<OrdersPage />}
            />

            {/* Admin Dashboard */}
              <Route
                path="/admin"
                element={<AdminDashboard />}
            />

            {/* Invalid route */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}

export default AppRoutes;