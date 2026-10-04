import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();

  return (
    <div
      className="logo"
      onClick={() => navigate("/customerhome")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate("/customerhome")}
      style={{ cursor: "pointer" }}
    >
      <div className="logo-icon">S</div>
      <span>SalesSavvy</span>
    </div>
  );
}

export default Logo;