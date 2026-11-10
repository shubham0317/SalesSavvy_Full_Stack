import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { createRazorpayOrder, verifyRazorpayPayment } from "../services/paymentApi";
import { formatCurrency } from "../utils/formatters";
import { SHIPPING_COST } from "../utils/constants";
import "../cssfiles/CartPage.css";

function CartPage() {
  const navigate = useNavigate();
  const { username } = useAuth();
  const { cartItems, loading, error, loadCart, changeQuantity, removeItem } = useCart();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [localError, setLocalError] = useState("");

  /* Load Razorpay Checkout SDK */
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay Checkout loaded");
    script.onerror = () => console.error("Failed to load Razorpay Checkout");
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      if (!isCancelled) {
        await loadCart();
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [loadCart]);

  /* Calculate totals */
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.total_price || 0),
    0
  );

  const totalProducts = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const overallTotal = cartItems.length > 0 ? subtotal + SHIPPING_COST : 0;

  /* Razorpay Checkout */
  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        setLocalError("Your cart is empty.");
        return;
      }

      if (!window.Razorpay) {
        setLocalError("Razorpay is still loading. Please try again.");
        return;
      }

      setProcessingPayment(true);
      setLocalError("");

      const paymentCartItems = cartItems.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price_per_unit,
      }));

      const res = await createRazorpayOrder(overallTotal, paymentCartItems);
      if (!res.ok) {
        throw new Error(res.error || "Failed to create Razorpay order");
      }

      const razorpayOrderId = typeof res.data === "string" ? res.data : res.data?.orderId || res.data?.id;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(overallTotal * 100),
        currency: "INR",
        name: "SalesSavvy",
        description: "SalesSavvy Order",
        order_id: razorpayOrderId,

        handler: async function (paymentResponse) {
          try {
            const verifyRes = await verifyRazorpayPayment({
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            });

            if (!verifyRes.ok) {
              throw new Error(verifyRes.error || "Payment verification failed");
            }

            alert("Payment successful!");
            loadCart();
            navigate("/orders");
          } catch (err) {
            console.error("Payment verification error:", err);
            setLocalError("Payment completed, but verification failed. Please contact support.");
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: username || "Customer",
          email: "",
          contact: "",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (resp) {
        console.error("Payment failed:", resp.error);
        setLocalError(resp.error?.description || "Payment failed. Please try again.");
        setProcessingPayment(false);
      });

      razorpay.open();
    } catch (err) {
      console.error("Checkout error:", err);
      setLocalError(err.message || "Unable to start payment.");
      setProcessingPayment(false);
    }
  };

  const activeError = localError || error;

  if (loading) {
    return (
      <div className="cart-page">
        <Header />
        <main className="cart-loading">
          <div className="cart-spinner"></div>
          <p>Loading your cart...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />

      <main className="cart-container">
        {/* Page heading */}
        <div className="cart-heading">
          <div>
            <p className="cart-eyebrow">SHOPPING BAG</p>
            <h1>Your Cart</h1>
            <p className="cart-subtitle">Review your selected items before checkout.</p>
          </div>

          <div className="cart-item-count">
            {totalProducts} {totalProducts === 1 ? "Item" : "Items"}
          </div>
        </div>

        {/* Error */}
        {activeError && (
          <div className="cart-error">
            <span>⚠</span>
            <p>{activeError}</p>
            <button onClick={() => setLocalError("")}>×</button>
          </div>
        )}

        {/* Empty cart */}
        {cartItems.length === 0 ? (
          <section className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Add some items to your cart to get started!</p>
            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/customerhome")}
            >
              Continue Shopping
            </button>
          </section>
        ) : (
          <div className="cart-layout">
            {/* Cart items */}
            <section className="cart-items-section">
              <div className="cart-section-header">
                <h2>Cart Items</h2>
                <span>{totalProducts} products</span>
              </div>

              <div className="cart-items">
                {cartItems.map((item) => (
                  <article className="cart-item" key={item.product_id}>
                    {/* Product image */}
                    <div className="cart-product-image">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            if (e.currentTarget.parentElement) {
                              e.currentTarget.parentElement.classList.add("image-fallback");
                            }
                          }}
                        />
                      ) : (
                        <div className="image-fallback">🛍️</div>
                      )}
                    </div>

                    {/* Product details */}
                    <div className="cart-product-details">
                      <h3>{item.name}</h3>
                      <p className="cart-product-description">{item.description}</p>
                      <p className="cart-unit-price">
                        {formatCurrency(item.price_per_unit)} per unit
                      </p>

                      {/* Quantity control */}
                      <div className="cart-actions">
                        <div className="quantity-control">
                          <button
                            onClick={() => changeQuantity(item.product_id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => changeQuantity(item.product_id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="remove-btn"
                          onClick={() => removeItem(item.product_id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="cart-item-total">
                      <span>Total</span>
                      <strong>{formatCurrency(item.total_price)}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Order summary */}
            <aside className="order-summary">
              <div className="summary-header">
                <h2>Order Summary</h2>
                <span>{totalProducts} items</span>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <strong>{formatCurrency(SHIPPING_COST)}</strong>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <span>Total</span>
                <strong>{formatCurrency(overallTotal)}</strong>
              </div>

              {/* PAYMENT BUTTON */}
              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={processingPayment}
              >
                {processingPayment ? "Processing..." : "Proceed to Checkout"}
                {!processingPayment && <span>→</span>}
              </button>

              <button
                className="continue-btn"
                onClick={() => navigate("/customerhome")}
              >
                ← Continue Shopping
              </button>

              <div className="secure-checkout">
                <span>🔒</span>
                <div>
                  <strong>Secure Checkout</strong>
                  <small>Your information is protected.</small>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CartPage;