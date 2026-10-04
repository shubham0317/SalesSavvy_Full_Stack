import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role && role.toUpperCase() !== requiredRole.toUpperCase()) {
    if (role.toUpperCase() === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/customerhome" replace />;
  }

  return children;
}
