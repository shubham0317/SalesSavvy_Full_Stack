import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import userImg from "../assets/user.png";

function ProfileDropdown({ username: propUsername }) {
  const [isOpen, setIsOpen] = useState(false);
  const { username: contextUsername, logout } = useAuth();
  const navigate = useNavigate();

  const username = propUsername || contextUsername || "Guest";

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <div className="profile-dropdown">
      <button
        type="button"
        className="profile-button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        <img src={userImg} alt="User Avatar" />
        <span>{username}</span>
        <span className="profile-arrow">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <Link to="/orders" onClick={() => setIsOpen(false)}>
            Orders
          </Link>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;