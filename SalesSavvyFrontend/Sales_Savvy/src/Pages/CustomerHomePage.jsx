import React, {
    useState,
    useEffect
} from "react";

import Header from "../components/Header";
import CategoryNavigation from "../components/CategoryNavigation";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";

import "../cssfiles/Customer.css";


function CustomerHomePage() {

    const [products, setProducts] = useState([]);

    const [cartCount, setCartCount] = useState(0);

    const [username, setUsername] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ================================
    // GET USERNAME
    // ================================

    useEffect(() => {

        const storedUsername =
            localStorage.getItem("username");

        if (storedUsername) {
            setUsername(storedUsername);
        }

    }, []);


    // ================================
    // FETCH PRODUCTS
    // ================================

    useEffect(() => {

        fetchProducts("Shirts");

    }, []);


    // ================================
    // FETCH CART COUNT
    // ================================

    useEffect(() => {

        if (username) {
            fetchCartCount();
        }

    }, [username]);


    // ================================
    // FETCH PRODUCTS FUNCTION
    // ================================

    const fetchProducts = async (category) => {

        setLoading(true);
        setError("");

        try {

            const response = await fetch(
                `http://localhost:8080/api/products?category=${encodeURIComponent(category)}`,
                {
                    credentials: "include"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch products"
                );

            }


            const data =
                await response.json();


            console.log(
                "Products response:",
                data
            );


            // Backend returns array
            if (Array.isArray(data)) {

                setProducts(data);

            }

            // Backend returns object
            else if (data.products) {

                setProducts(
                    data.products
                );


                // Get username from backend
                if (data.user) {

                    const backendUsername =
                        data.user.username ||
                        data.user.name ||
                        "";

                    if (backendUsername) {

                        setUsername(
                            backendUsername
                        );

                        // Keep username available
                        // for other components/API calls
                        localStorage.setItem(
                            "username",
                            backendUsername
                        );
                    }
                }

            }

            else {

                setProducts([]);

            }

        } catch (error) {

            console.error(
                "Product fetch error:",
                error
            );

            setError(
                "Unable to load products."
            );

            setProducts([]);

        } finally {

            setLoading(false);

        }
    };


    // ================================
    // FETCH CART COUNT
    // ================================

    const fetchCartCount = async () => {

        // Don't call API without username
        if (!username) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:8080/api/cart/items/count?username=${encodeURIComponent(username)}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


            if (!response.ok) {

                throw new Error(
                    `Failed to fetch cart count: ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log(
                "Cart count response:",
                data
            );


            /*
             * Backend can return:
             *
             * 3
             *
             * OR
             *
             * {
             *     "count": 3
             * }
             */


            if (typeof data === "number") {

                setCartCount(data);

            }

            else if (
                data &&
                typeof data.count === "number"
            ) {

                setCartCount(data.count);

            }

            else {

                console.warn(
                    "Unexpected cart count response:",
                    data
                );

            }

        } catch (error) {

            console.error(
                "Cart count error:",
                error
            );

            /*
             * Don't reset cartCount to 0 here.
             *
             * If the request temporarily fails,
             * keep the previous value displayed.
             */
        }
    };


    // ================================
    // CATEGORY CLICK
    // ================================

    const handleCategoryClick = (category) => {

        fetchProducts(category);

    };


    // ================================
    // ADD TO CART
    // ================================

    const handleAddToCart = async (productId) => {

        if (!username) {

            alert(
                "Please login first."
            );

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:8080/api/cart/add",
                {
                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        productId: productId
                    })
                }
            );


            // ================================
            // SUCCESS
            // ================================

            if (response.ok) {

                /*
                 * Wait until backend has added
                 * the product and return the
                 * updated cart count.
                 */

                await fetchCartCount();


                alert(
                    "Product added to cart!"
                );

            }


            // ================================
            // ERROR
            // ================================

            else {

                let data = {};

                try {

                    data =
                        await response.json();

                } catch {

                    // Response wasn't JSON
                }


                alert(
                    data.message ||
                    data.error ||
                    "Failed to add product to cart."
                );

            }

        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );

            alert(
                "Unable to add product to cart."
            );
        }
    };


    // ================================
    // RETURN
    // ================================

    return (

        <div className="customer-homepage">


            {/* HEADER */}

            <Header
                cartCount={cartCount}
                username={username}
            />


            {/* CATEGORY NAVIGATION */}

            <div className="navigation">

                <CategoryNavigation
                    onCategoryClick={
                        handleCategoryClick
                    }
                />

            </div>


            {/* MAIN CONTENT */}

            <main className="main-content">

                <section className="products-section">


                    {/* SECTION HEADER */}

                    <div className="section-header">

                        <div>

                            <span className="section-label">
                                OUR COLLECTION
                            </span>


                            <h1>
                                Explore Products
                            </h1>


                            <p>
                                Find everything you need
                                in one place.
                            </p>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="server-error">

                            {error}

                        </div>

                    )}


                    {/* LOADING */}

                    {loading ? (

                        <div className="loading-message">

                            <div className="loading-spinner">
                            </div>


                            <p>
                                Loading products...
                            </p>

                        </div>

                    ) : (

                        <ProductList
                            products={products}
                            onAddToCart={
                                handleAddToCart
                            }
                        />

                    )}

                </section>

            </main>


            {/* FOOTER */}

            <Footer />

        </div>
    );
}


export default CustomerHomePage;