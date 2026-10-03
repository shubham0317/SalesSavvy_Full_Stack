import { useNavigate } from "react-router-dom";
import "../cssfiles/AdminHeader.css";

function AdminHeader() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout error:", error);
        }

        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="admin-header">

            <div className="admin-header-inner">

                {/* Logo */}
                <div
                    className="admin-brand"
                    onClick={() => navigate("/admin")}
                >
                    <div className="admin-logo">
                        S
                    </div>

                    <div className="admin-brand-text">
                        <strong>SalesSavvy</strong>
                        <span>ADMIN PANEL</span>
                    </div>
                </div>


                {/* Navigation */}
                <nav className="admin-nav">

                    <button
                        className="admin-nav-btn active"
                        onClick={() => navigate("/admin")}
                    >
                        Dashboard
                    </button>

                    {/* <button
                        className="admin-nav-btn"
                        onClick={() => navigate("/customerhome")}
                    >
                        Store
                    </button> */}

                </nav>


                {/* User Section */}
                <div className="admin-header-right">

                    <div className="admin-user">

                        <div className="admin-avatar">
                            A
                        </div>

                        <div className="admin-user-details">
                            <strong>Admin</strong>
                            <span>Administrator</span>
                        </div>

                    </div>

                    <button
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