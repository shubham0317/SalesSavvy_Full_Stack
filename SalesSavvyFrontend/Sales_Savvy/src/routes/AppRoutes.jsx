import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../Pages/Login";
import Register from "../Pages/Register";
import CustomerHomePage from "../Pages/CustomerHomePage";

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

            {/* Customer routes */}
            <Route
                path="/customerhome"
                element={<CustomerHomePage />}
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