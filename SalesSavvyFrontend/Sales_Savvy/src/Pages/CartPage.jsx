import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import  Header  from "../components/Header";
import  Footer  from "../components/Footer";
import "../cssfiles/CartPage.css";

const API_URL = "http://localhost:8080";

const SHIPPING_COST = 370;

function CartPage() {

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /*
     * Fetch cart items
     */
    const fetchCartItems = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/cart/items`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (response.status === 401) {
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch cart items");
            }

            const data = await response.json();

            console.log("Cart response:", data);

            setUsername(data?.username || "");

            const products = data?.cart?.products || [];

            setCartItems(products);

        } catch (error) {

            console.error("Error fetching cart:", error);

            setError(
                error.message || "Unable to load your cart."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchCartItems();

    }, []);


    /*
     * Remove item
     */
    const handleRemoveItem = async (productId) => {

        try {

            const response = await fetch(
                `${API_URL}/api/cart/delete`,
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        username: username,
                        productId: productId
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to remove item");
            }

            setCartItems(prevItems =>
                prevItems.filter(
                    item => item.product_id !== productId
                )
            );

        } catch (error) {

            console.error("Error removing item:", error);

            setError("Unable to remove item from cart.");
        }
    };


    /*
     * Update quantity
     */
    const handleQuantityChange = async (
        productId,
        newQuantity
    ) => {

        if (newQuantity <= 0) {

            await handleRemoveItem(productId);

            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/api/cart/update`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        username: username,
                        productId: productId,
                        quantity: newQuantity
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to update quantity"
                );
            }

            setCartItems(prevItems =>
                prevItems.map(item => {

                    if (item.product_id === productId) {

                        const newTotal =
                            Number(item.price_per_unit) *
                            newQuantity;

                        return {
                            ...item,
                            quantity: newQuantity,
                            total_price: newTotal
                        };
                    }

                    return item;
                })
            );

        } catch (error) {

            console.error(
                "Error updating quantity:",
                error
            );

            setError(
                "Unable to update item quantity."
            );
        }
    };


    /*
     * Calculate subtotal
     */
    const subtotal = cartItems.reduce(
        (total, item) =>
            total +
            Number(item.total_price || 0),
        0
    );


    /*
     * Number of products
     */
    const totalProducts = cartItems.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );


    /*
     * Overall total
     */
    const overallTotal =
        cartItems.length > 0
            ? subtotal + SHIPPING_COST
            : 0;


    /*
     * Loading
     */
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
                        <p className="cart-eyebrow">
                            SHOPPING BAG
                        </p>

                        <h1>
                            Your Cart
                        </h1>

                        <p className="cart-subtitle">
                            Review your selected items
                            before checkout.
                        </p>
                    </div>

                    <div className="cart-item-count">

                        {totalProducts}{" "}
                        {totalProducts === 1
                            ? "Item"
                            : "Items"}

                    </div>

                </div>


                {/* Error */}

                {error && (

                    <div className="cart-error">

                        <span>⚠</span>

                        <p>{error}</p>

                        <button
                            onClick={() => setError("")}
                        >
                            ×
                        </button>

                    </div>
                )}


                {/* Empty cart */}

                {cartItems.length === 0 ? (

                    <section className="empty-cart">

                        <div className="empty-cart-icon">
                            🛒
                        </div>

                        <h2>
                            Your Cart is Empty
                        </h2>

                        <p>
                            Add some items to your cart
                            to get started!
                        </p>

                        <button
                            className="continue-shopping-btn"
                            onClick={() =>
                                navigate("/customerhome")
                            }
                        >
                            Continue Shopping
                        </button>

                    </section>

                ) : (

                    <div className="cart-layout">

                        {/* Cart items */}

                        <section className="cart-items-section">

                            <div className="cart-section-header">

                                <h2>
                                    Cart Items
                                </h2>

                                <span>
                                    {totalProducts} products
                                </span>

                            </div>


                            <div className="cart-items">

                                {cartItems.map(item => (

                                    <article
                                        className="cart-item"
                                        key={item.product_id}
                                    >

                                        {/* Product image */}

                                        <div className="cart-product-image">

                                            {item.image_url ? (

                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            "none";
                                                        e.currentTarget.parentElement.classList.add(
                                                            "image-fallback"
                                                        );
                                                    }}
                                                />

                                            ) : (

                                                <div className="image-fallback">
                                                    🛍️
                                                </div>

                                            )}

                                        </div>


                                        {/* Product details */}

                                        <div className="cart-product-details">

                                            <h3>
                                                {item.name}
                                            </h3>

                                            <p className="cart-product-description">
                                                {item.description}
                                            </p>

                                            <p className="cart-unit-price">
                                                ₹{Number(
                                                    item.price_per_unit
                                                ).toFixed(2)}
                                                {" "}per unit
                                            </p>


                                            {/* Quantity */}

                                            <div className="cart-actions">

                                                <div className="quantity-control">

                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.product_id,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        aria-label="Decrease quantity"
                                                    >
                                                        −
                                                    </button>

                                                    <span>
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.product_id,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>

                                                </div>


                                                <button
                                                    className="remove-btn"
                                                    onClick={() =>
                                                        handleRemoveItem(
                                                            item.product_id
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        </div>


                                        {/* Total */}

                                        <div className="cart-item-total">

                                            <span>
                                                Total
                                            </span>

                                            <strong>
                                                ₹{Number(
                                                    item.total_price
                                                ).toFixed(2)}
                                            </strong>

                                        </div>

                                    </article>

                                ))}

                            </div>

                        </section>


                        {/* Order summary */}

                        <aside className="order-summary">

                            <div className="summary-header">

                                <h2>
                                    Order Summary
                                </h2>

                                <span>
                                    {totalProducts} items
                                </span>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹{subtotal.toFixed(2)}
                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Shipping
                                </span>

                                <strong>
                                    ₹{SHIPPING_COST.toFixed(2)}
                                </strong>

                            </div>


                            <div className="summary-divider"></div>


                            <div className="summary-row total-row">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹{overallTotal.toFixed(2)}
                                </strong>

                            </div>


                            <button
                                className="checkout-btn"
                                onClick={() =>
                                    alert(
                                        "Checkout will be implemented next."
                                    )
                                }
                            >
                                Proceed to Checkout
                                <span>→</span>
                            </button>


                            <button
                                className="continue-btn"
                                onClick={() =>
                                    navigate("/customerhome")
                                }
                            >
                                ← Continue Shopping
                            </button>


                            <div className="secure-checkout">

                                <span>🔒</span>

                                <div>
                                    <strong>
                                        Secure Checkout
                                    </strong>

                                    <small>
                                        Your information is
                                        protected.
                                    </small>
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