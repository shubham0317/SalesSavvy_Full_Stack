import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../cssfiles/OrderPage.css";

const API_URL = "http://localhost:8080";

export default function OrdersPage() {

    const [orders, setOrders] = useState([]);
    const [username, setUsername] = useState("");
    const [cartCount, setCartCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [cartLoading, setCartLoading] = useState(true);
    const [cartError, setCartError] = useState(false);


    // ==============================
    // Fetch Orders
    // ==============================

    const fetchOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/api/orders`, {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {

                if (response.status === 401) {
                    throw new Error("User is not authenticated.");
                }

                throw new Error("Failed to fetch orders.");
            }

            const data = await response.json();

            setUsername(data.username || "");

            setOrders(data.products || []);

        } catch (error) {

            console.error("Error fetching orders:", error);

            setError(error.message);

        } finally {

            setLoading(false);

        }
    };


    // ==============================
    // Fetch Cart Count
    // ==============================

    const fetchCartCount = async () => {

        try {

            setCartLoading(true);

            const response = await fetch(
                `${API_URL}/api/cart/items/count`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch cart count.");
            }

            const count = await response.json();

            setCartCount(count);
            setCartError(false);

        } catch (error) {

            console.error("Error fetching cart count:", error);

            setCartError(true);

        } finally {

            setCartLoading(false);

        }
    };


    // ==============================
    // Component Load
    // ==============================

    useEffect(() => {

        fetchOrders();
        fetchCartCount();

    }, []);


    // ==============================
    // Render
    // ==============================

    return (

        <div className="orders-page">

            <Header
                username={username}
                cartCount={
                    cartLoading
                        ? "..."
                        : cartError
                            ? "!"
                            : cartCount
                }
            />


            <main className="orders-container">

                <div className="orders-header">

                    <div>

                        <p className="orders-eyebrow">
                            ACCOUNT
                        </p>

                        <h1>
                            Your Orders
                        </h1>

                        <p className="orders-subtitle">
                            View your previous purchases and order details.
                        </p>

                    </div>

                    {!loading && !error && orders.length > 0 && (

                        <div className="orders-count">

                            <span>{orders.length}</span>

                            <p>
                                {orders.length === 1
                                    ? "Order"
                                    : "Orders"}
                            </p>

                        </div>

                    )}

                </div>


                {/* Loading */}

                {loading && (

                    <div className="orders-state">

                        <div className="orders-loader"></div>

                        <p>
                            Loading your orders...
                        </p>

                    </div>

                )}


                {/* Error */}

                {!loading && error && (

                    <div className="orders-state orders-error">

                        <div className="state-icon">
                            !
                        </div>

                        <h2>
                            Unable to load orders
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            className="retry-button"
                            onClick={fetchOrders}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* No Orders */}

                {!loading &&
                    !error &&
                    orders.length === 0 && (

                        <div className="orders-state empty-orders">

                            <div className="empty-icon">
                                🛍
                            </div>

                            <h2>
                                No orders found
                            </h2>

                            <p>
                                You haven't placed any orders yet.
                            </p>

                            <button
                                className="shop-button"
                                onClick={() =>
                                    window.location.href = "/customerhome"
                                }
                            >
                                Start Shopping
                            </button>

                        </div>

                    )}


                {/* Orders */}

                {!loading &&
                    !error &&
                    orders.length > 0 && (

                        <div className="orders-list">

                            {orders.map((order, index) => (

                                <div
                                    className="order-card"
                                    key={`${order.order_id}-${index}`}
                                >

                                    {/* Order Header */}

                                    <div className="order-card-header">

                                        <div>

                                            <span className="order-label">
                                                ORDER ID
                                            </span>

                                            <h2>
                                                {order.order_id}
                                            </h2>

                                        </div>

                                        <span className="order-status">
                                            PAID
                                        </span>

                                    </div>


                                    {/* Order Body */}

                                    <div className="order-card-content">

                                        <div className="order-image-wrapper">

                                            <img
                                                src={
                                                    order.image_url ||
                                                    "/default-product.png"
                                                }
                                                alt={order.name}
                                                className="order-product-image"
                                            />

                                        </div>


                                        <div className="order-details">

                                            <h3 className="order-product-name">
                                                {order.name}
                                            </h3>

                                            <p className="order-description">
                                                {order.description}
                                            </p>


                                            <div className="order-info-grid">

                                                <div className="order-info-item">

                                                    <span>
                                                        Quantity
                                                    </span>

                                                    <strong>
                                                        {order.quantity}
                                                    </strong>

                                                </div>


                                                <div className="order-info-item">

                                                    <span>
                                                        Price per Unit
                                                    </span>

                                                    <strong>
                                                        ₹
                                                        {Number(
                                                            order.price_per_unit
                                                        ).toFixed(2)}
                                                    </strong>

                                                </div>


                                                <div className="order-info-item">

                                                    <span>
                                                        Total Price
                                                    </span>

                                                    <strong className="order-total">
                                                        ₹
                                                        {Number(
                                                            order.total_price
                                                        ).toFixed(2)}
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