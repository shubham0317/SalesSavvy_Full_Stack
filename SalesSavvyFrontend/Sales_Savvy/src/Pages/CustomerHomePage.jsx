import { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import CategoryNavigation from "../components/CategoryNavigation";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";
import { fetchProductsByCategory } from "../services/productApi";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import "../cssfiles/Customer.css";

function CustomerHomePage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Shirts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const { username, setUsername } = useAuth();
  const { addItemToCart } = useCart();

  const loadProducts = useCallback(async (category) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchProductsByCategory(category);
      if (res.ok) {
        const data = res.data;
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && data.products) {
          setProducts(data.products);
          if (data.user) {
            const backendUsername = data.user.username || data.user.name || "";
            if (backendUsername && !username) {
              setUsername(backendUsername);
              localStorage.setItem("username", backendUsername);
            }
          }
        } else {
          setProducts([]);
        }
      } else {
        setError(res.error || "Unable to load products.");
        setProducts([]);
      }
    } catch (err) {
      console.error("Product fetch error:", err);
      setError("Unable to load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [username, setUsername]);

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      if (!isCancelled) {
        await loadProducts(activeCategory);
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [activeCategory, loadProducts]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleAddToCart = async (productId) => {
    if (!username) {
      setNotification("Please login first.");
      return;
    }

    const result = await addItemToCart(productId);
    if (result.success) {
      setNotification(result.message || "Product added to cart!");
    } else {
      setNotification(result.error || "Failed to add product to cart.");
    }

    setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  return (
    <div className="customer-homepage">
      {/* HEADER */}
      <Header />

      {/* CATEGORY NAVIGATION */}
      <div className="navigation">
        <CategoryNavigation
          onCategoryClick={handleCategoryClick}
          activeCategory={activeCategory}
        />
      </div>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <section className="products-section">
          {/* SECTION HEADER */}
          <div className="section-header">
            <div>
              <span className="section-label">OUR COLLECTION</span>
              <h1>Explore {activeCategory}</h1>
              <p>Find everything you need in one place.</p>
            </div>
          </div>

          {/* NOTIFICATION */}
          {notification && (
            <div className={`server-error ${notification.includes("added") ? "success-toast" : ""}`}>
              {notification}
            </div>
          )}

          {/* ERROR */}
          {error && <div className="server-error">{error}</div>}

          {/* LOADING / PRODUCTS */}
          {loading ? (
            <div className="loading-message">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            <ProductList products={products} onAddToCart={handleAddToCart} />
          )}
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default CustomerHomePage;