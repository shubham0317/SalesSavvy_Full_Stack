import React from "react";
import { useNavigate } from "react-router-dom";

function CartIcon({ count }) {

  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/UserCartPage");
  };

  return (
    <div
      className="cart-icon"
      onClick={handleCartClick}
    >

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="cart-icon-svg"
      >

        <path
          d="M3 3h2l2 13h10l3-9H6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx="9"
          cy="20"
          r="1.5"
        />

        <circle
          cx="18"
          cy="20"
          r="1.5"
        />

      </svg>

      <span className="cart-badge">
        {count}
      </span>

    </div>
  );
}

export default CartIcon;