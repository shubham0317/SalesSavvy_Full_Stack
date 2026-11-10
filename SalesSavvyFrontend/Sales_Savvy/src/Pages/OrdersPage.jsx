import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchUserOrders } from "../services/orderApi";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency } from "../utils/formatters";
import "../cssfiles/OrderPage.css";

export default function OrdersPage() {
  const navigate = useNavigate();
  const { username, setUsername } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchUserOrders();
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("User is not authenticated.");
        }
        throw new Error(res.error || "Failed to fetch orders.");
      }

      if (res.data) {
        if (res.data.username && !username) {
          setUsername(res.data.username);
        }
        setOrders(res.data.products || res.data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, [username, setUsername]);

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      if (!isCancelled) {
        await loadOrders();
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [loadOrders]);

  return (
    <div className="orders-page">
      <Header />

      <main className="orders-container">
        <div className="orders-header">
          <div>
            <p className="orders-eyebrow">ACCOUNT</p>
            <h1>Your Orders</h1>
            <p className="orders-subtitle">View your previous purchases and order details.</p>
          </div>

          {!loading && !error && orders.length > 0 && (
            <div className="orders-count">
              <span>{orders.length}</span>
              <p>{orders.length === 1 ? "Order" : "Orders"}</p>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="orders-state">
            <div className="orders-loader"></div>
            <p>Loading your orders...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="orders-state orders-error">
            <div className="state-icon">!</div>
            <h2>Unable to load orders</h2>
            <p>{error}</p>
            <button className="retry-button" onClick={loadOrders}>
              Try Again
            </button>
          </div>
        )}

        {/* No Orders */}
        {!loading && !error && orders.length === 0 && (
          <div className="orders-state empty-orders">
            <div className="empty-icon">🛍</div>
            <h2>No orders found</h2>
            <p>You haven't placed any orders yet.</p>
            <button
              className="shop-button"
              onClick={() => navigate("/customerhome")}
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order, index) => (
              <div
                className="order-card"
                key={`${order.order_id || order.id || index}-${index}`}
              >
                {/* Order Header */}
                <div className="order-card-header">
                  <div>
                    <span className="order-label">ORDER ID</span>
                    <h2>{order.order_id || order.id || `ORD-${index + 1}`}</h2>
                  </div>

                  <span className="order-status">PAID</span>
                </div>

                {/* Order Body */}
                <div className="order-card-content">
                  <div className="order-image-wrapper">
                    <img
                      src={order.image_url || order.imageUrl || "/default-product.png"}
                      alt={order.name}
                      className="order-product-image"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <div className="order-details">
                    <h3 className="order-product-name">{order.name}</h3>
                    <p className="order-description">{order.description}</p>

                    <div className="order-info-grid">
                      <div className="order-info-item">
                        <span>Quantity</span>
                        <strong>{order.quantity}</strong>
                      </div>

                      <div className="order-info-item">
                        <span>Price per Unit</span>
                        <strong>{formatCurrency(order.price_per_unit || order.price)}</strong>
                      </div>

                      <div className="order-info-item">
                        <span>Total Price</span>
                        <strong className="order-total">
                          {formatCurrency(order.total_price || (order.price * order.quantity))}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}