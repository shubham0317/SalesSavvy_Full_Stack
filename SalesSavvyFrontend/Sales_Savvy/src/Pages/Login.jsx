import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../cssfiles/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        setErrors({});
        setMessage(result.message || "Login successful!");

        // Seamless route navigation based on user role
        if (result.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/customerhome");
        }
      } else {
        setMessage(result.error || "Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to server. Please check backend status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background */}
      <div className="ecommerce-background">
        <div className="floating-item item-one">🛍️</div>
        <div className="floating-item item-two">📦</div>
        <div className="floating-item item-three">🛒</div>
        <div className="floating-item item-four">👟</div>
        <div className="floating-item item-five">🎧</div>
        <div className="floating-item item-six">📱</div>

        <div className="floating-card card-one">
          <span>🛍️</span>
          <div>
            <strong>Shopping</strong>
            <small>Made Simple</small>
          </div>
        </div>

        <div className="floating-card card-two">
          <span>📦</span>
          <div>
            <strong>Fast Delivery</strong>
            <small>At your doorstep</small>
          </div>
        </div>

        <div className="glow glow-one"></div>
        <div className="glow glow-two"></div>
      </div>

      {/* Login Card */}
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="logo-box">
            <span>L</span>
          </div>

          <h1>Welcome Back</h1>
          <p>Login to access your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Server Message */}
          {message && (
            <div
              className={
                message.toLowerCase().includes("success")
                  ? "success-message"
                  : "server-error"
              }
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
            {!loading && <span>→</span>}
          </button>
        </form>

        {/* Register Link */}
        <div className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;