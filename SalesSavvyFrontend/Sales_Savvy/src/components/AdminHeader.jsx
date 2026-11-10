import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../cssfiles/AdminHeader.css";

function AdminHeader() {
    const navigate = useNavigate();
    const { logout, username } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <header className="admin-header">
            <div className="admin-header-inner">
                {/* Logo */}
                <div
                    className="admin-brand"
                    onClick={() => navigate("/admin")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate("/admin")}
                >
                    <div className="admin-logo">S</div>
                    <div className="admin-brand-text">
                        <strong>SalesSavvy</strong>
                        <span>ADMIN PANEL</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="admin-nav">
                    <button
                        type="button"
                        className="admin-nav-btn active"
                        onClick={() => navigate("/admin")}
                    >
                        Dashboard
                    </button>
                </nav>

                {/* User Section */}
                <div className="admin-header-right">
                    <div className="admin-user">
                        <div className="admin-avatar">A</div>
                        <div className="admin-user-details">
                            <strong>{username || "Admin"}</strong>
                            <span>Administrator</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="admin-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;