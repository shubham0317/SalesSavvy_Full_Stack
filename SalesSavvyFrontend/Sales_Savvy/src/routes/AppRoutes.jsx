import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../Pages/Login";
import Register from "../Pages/Register";
import CustomerHomePage from "../Pages/CustomerHomePage";
import CartPage from "../Pages/CartPage";

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

            {/* Invalid route */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}

export default AppRoutes;