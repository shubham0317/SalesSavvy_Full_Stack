import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../cssfiles/Register.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
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
    } else if (formData.username.length < 5 || formData.username.length > 50) {
      newErrors.username = "Username must be between 5 and 50 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters";
    } else if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[!@#$%^&*]/.test(formData.password)
    ) {
      newErrors.password =
        "Use uppercase, lowercase, number and special character";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
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
      const result = await register(formData);
      if (result.success) {
        setMessage(result.message || "User registered successfully!");
        setErrors({});
        setFormData({
          username: "",
          email: "",
          password: "",
          role: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(result.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Unable to connect to server. Please check backend status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
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

      {/* Register Card */}
      <div className="register-card">
        <div className="register-header">
          <div className="logo-box">
            <span>R</span>
          </div>

          <h1>Create Account</h1>
          <p>Register your account to get started</p>
        </div>

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

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
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
                autoComplete="new-password"
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <small className="password-hint">
              8+ characters with uppercase, lowercase, number and special character
            </small>

            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select your role</option>
              <option value="ADMIN">Admin</option>
              <option value="CUSTOMER">Customer</option>
            </select>

            {errors.role && (
              <span className="error-message">{errors.role}</span>
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
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <span>→</span>}
          </button>
        </form>

        {/* Login Link */}
        <div className="login-link">
          Already a user? <Link to="/login">Log in here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;