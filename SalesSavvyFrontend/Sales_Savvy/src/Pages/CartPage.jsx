import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../cssfiles/CartPage.css";

const API_URL = "http://localhost:8080";

const SHIPPING_COST = 370;

function CartPage() {

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingPayment, setProcessingPayment] = useState(false);


    /*
     * Load Razorpay Checkout SDK
     */
    useEffect(() => {

        const script = document.createElement("script");

        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => {
            console.log("Razorpay Checkout loaded");
        };

        script.onerror = () => {
            console.error("Failed to load Razorpay Checkout");
        };

        document.body.appendChild(script);

        return () => {

            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }

        };

    }, []);


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

                throw new Error(
                    "Failed to fetch cart items"
                );
            }

            const data = await response.json();

            console.log("Cart response:", data);

            setUsername(data?.username || "");

            const products =
                data?.cart?.products || [];

            setCartItems(products);

        } catch (error) {

            console.error(
                "Error fetching cart:",
                error
            );

            setError(
                error.message ||
                "Unable to load your cart."
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

                throw new Error(
                    "Failed to remove item"
                );
            }

            setCartItems(prevItems =>
                prevItems.filter(
                    item =>
                        item.product_id !== productId
                )
            );

        } catch (error) {

            console.error(
                "Error removing item:",
                error
            );

            setError(
                "Unable to remove item from cart."
            );
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

                    if (
                        item.product_id === productId
                    ) {

                        const newTotal =
                            Number(
                                item.price_per_unit
                            ) *
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
            total +
            Number(item.quantity || 0),
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
     * Razorpay Checkout
     */
    const handleCheckout = async () => {

        try {

            if (cartItems.length === 0) {

                alert("Your cart is empty.");

                return;
            }


            /*
             * Make sure Razorpay SDK is loaded
             */
            if (!window.Razorpay) {

                alert(
                    "Razorpay is still loading. Please try again."
                );

                return;
            }


            setProcessingPayment(true);


            /*
             * Prepare cart items
             *
             * This matches your PaymentController:
             *
             * totalAmount
             * cartItems
             */
            const paymentCartItems =
                cartItems.map(item => ({

                    productId:
                        item.product_id,

                    quantity:
                        item.quantity,

                    price:
                        item.price_per_unit

                }));


            /*
             * Create Razorpay order
             *
             * Backend:
             *
             * POST /api/payment/create
             */
            const response = await fetch(
                `${API_URL}/api/payment/create`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({

                        totalAmount:
                            overallTotal,

                        cartItems:
                            paymentCartItems

                    })
                }
            );


            if (!response.ok) {

                const errorMessage =
                    await response.text();

                throw new Error(
                    errorMessage ||
                    "Failed to create Razorpay order"
                );
            }


            /*
             * Backend returns Razorpay Order ID
             */
            const razorpayOrderId =
                await response.text();


            console.log(
                "Razorpay Order ID:",
                razorpayOrderId
            );


            /*
             * Razorpay Checkout configuration
             */
            const options = {

                /*
                 * IMPORTANT:
                 * This is the FRONTEND Key ID.
                 *
                 * Never put Key Secret here.
                 */
                key:
                    import.meta.env
                        .VITE_RAZORPAY_KEY_ID,


                /*
                 * Razorpay expects amount in paise
                 */
                amount:
                    Math.round(
                        overallTotal * 100
                    ),


                currency: "INR",

                name: "SalesSavvy",

                description:
                    "SalesSavvy Order",

                order_id:
                    razorpayOrderId,


                /*
                 * Payment successful
                 */
                handler: async function (
                    paymentResponse
                ) {

                    console.log(
                        "Payment response:",
                        paymentResponse
                    );


                    try {

                        /*
                         * Verify payment with backend
                         *
                         * POST /api/payment/verify
                         */
                        const verifyResponse =
                            await fetch(
                                `${API_URL}/api/payment/verify`,
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    credentials:
                                        "include",

                                    body:
                                        JSON.stringify({

                                            razorpayOrderId:
                                                paymentResponse
                                                    .razorpay_order_id,

                                            razorpayPaymentId:
                                                paymentResponse
                                                    .razorpay_payment_id,

                                            razorpaySignature:
                                                paymentResponse
                                                    .razorpay_signature

                                        })
                                }
                            );


                        const result =
                            await verifyResponse.text();


                        if (!verifyResponse.ok) {

                            throw new Error(
                                result ||
                                "Payment verification failed"
                            );
                        }


                        /*
                         * Backend has:
                         *
                         * 1. Verified signature
                         * 2. Updated order to SUCCESS
                         * 3. Created OrderItems
                         * 4. Cleared cart
                         */
                        alert(
                            "Payment successful!"
                        );


                        navigate(
                            "/customerhome"
                        );


                    } catch (error) {

                        console.error(
                            "Payment verification error:",
                            error
                        );

                        alert(
                            "Payment was completed, but verification failed. Please contact support."
                        );

                    } finally {

                        setProcessingPayment(
                            false
                        );

                    }

                },


                /*
                 * Customer information
                 *
                 * You can replace these with
                 * actual user details later.
                 */
                prefill: {

                    name:
                        username || "Customer",

                    email: "",

                    contact: ""

                },


                theme: {

                    color: "#3399cc"

                },


                /*
                 * User closes Razorpay window
                 */
                modal: {

                    ondismiss: function () {

                        console.log(
                            "Razorpay checkout closed"
                        );

                        setProcessingPayment(
                            false
                        );

                    }

                }

            };


            /*
             * Create Razorpay instance
             */
            const razorpay =
                new window.Razorpay(
                    options
                );


            /*
             * Payment failed
             */
            razorpay.on(
                "payment.failed",
                function (response) {

                    console.error(
                        "Payment failed:",
                        response.error
                    );

                    alert(
                        response.error?.description ||
                        "Payment failed. Please try again."
                    );

                    setProcessingPayment(
                        false
                    );

                }
            );


            /*
             * Open Razorpay Checkout
             */
            razorpay.open();


        } catch (error) {

            console.error(
                "Checkout error:",
                error
            );

            alert(
                error.message ||
                "Unable to start payment. Please try again."
            );

            setProcessingPayment(false);
        }
    };


    /*
     * Loading
     */
    if (loading) {

        return (

            <div className="cart-page">

                <Header />

                <main className="cart-loading">

                    <div className="cart-spinner"></div>

                    <p>
                        Loading your cart...
                    </p>

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

                        {
                            totalProducts === 1
                                ? "Item"
                                : "Items"
                        }

                    </div>

                </div>


                {/* Error */}

                {error && (

                    <div className="cart-error">

                        <span>⚠</span>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={() =>
                                setError("")
                            }
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
                                navigate(
                                    "/customerhome"
                                )
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

                                {cartItems.map(
                                    item => (

                                        <article
                                            className="cart-item"
                                            key={
                                                item.product_id
                                            }
                                        >


                                            {/* Product image */}

                                            <div className="cart-product-image">

                                                {item.image_url ? (

                                                    <img
                                                        src={
                                                            item.image_url
                                                        }
                                                        alt={
                                                            item.name
                                                        }
                                                        onError={
                                                            (e) => {

                                                                e.currentTarget.style.display =
                                                                    "none";

                                                                e.currentTarget.parentElement.classList.add(
                                                                    "image-fallback"
                                                                );

                                                            }
                                                        }
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
                                                    {
                                                        item.description
                                                    }
                                                </p>

                                                <p className="cart-unit-price">

                                                    ₹
                                                    {Number(
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
                                                            {
                                                                item.quantity
                                                            }
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
                                                    ₹
                                                    {Number(
                                                        item.total_price
                                                    ).toFixed(2)}
                                                </strong>

                                            </div>

                                        </article>

                                    )
                                )}

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
                                    ₹
                                    {subtotal.toFixed(2)}
                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Shipping
                                </span>

                                <strong>
                                    ₹
                                    {SHIPPING_COST.toFixed(2)}
                                </strong>

                            </div>


                            <div className="summary-divider"></div>


                            <div className="summary-row total-row">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹
                                    {overallTotal.toFixed(2)}
                                </strong>

                            </div>


                            {/* PAYMENT BUTTON */}

                            <button
                                className="checkout-btn"
                                onClick={
                                    handleCheckout
                                }
                                disabled={
                                    processingPayment
                                }
                            >

                                {
                                    processingPayment
                                        ? "Processing..."
                                        : "Proceed to Checkout"
                                }

                                {!processingPayment && (
                                    <span>→</span>
                                )}

                            </button>


                            <button
                                className="continue-btn"
                                onClick={() =>
                                    navigate(
                                        "/customerhome"
                                    )
                                }
                            >
                                ← Continue Shopping
                            </button>


                            <div className="secure-checkout">

                                <span>
                                    🔒
                                </span>

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