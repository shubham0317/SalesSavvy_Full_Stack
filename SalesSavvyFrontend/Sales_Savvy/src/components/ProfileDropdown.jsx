import React, { useState } from "react";
import userImg from "../assets/user.png"

function ProfileDropdown({ username }) {

  const [isOpen, setIsOpen] =
    useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {

        localStorage.removeItem("token");

        localStorage.removeItem("username");

        window.location.href = "/login";

      } else {

        console.error("Logout failed");

      }

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

    }
  };

  return (

    <div className="profile-dropdown">

      <button
        className="profile-button"
        onClick={toggleDropdown}
      >

        <img
          src={userImg}
          alt="User Avatar"
        />

        <span>
          {username || "Guest"}
        </span>

        <span className="profile-arrow">
          {isOpen ? "▲" : "▼"}
        </span>

      </button>


      {isOpen && (

        <div className="dropdown-menu">

          <a href="/profile">
            Profile
          </a>

          <a href="/orders">
            Orders
          </a>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      )}

    </div>
  );
}

export default ProfileDropdown;