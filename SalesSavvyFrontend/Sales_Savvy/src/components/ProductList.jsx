import { formatCurrency } from "../utils/formatters";

function ProductList({ products, onAddToCart }) {
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <div className="no-products-icon">🛍️</div>
        <h3>No Products Available</h3>
        <p>There are no products available in this category.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const hasImage =
          Array.isArray(product.images) &&
          product.images.length > 0 &&
          product.images[0];

        const imageUrl = hasImage ? product.images[0] : product.imageUrl || product.image_url;

        return (
          <div key={product.product_id || product.id} className="product-card">
            <div className="product-image-container">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.classList.add("image-error");
                    }
                  }}
                />
              ) : (
                <div className="image-placeholder">
                  🛍️
                  <span>No Image</span>
                </div>
              )}
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>

              <div className="product-bottom">
                <span className="product-price">
                  {formatCurrency(product.price)}
                </span>

                <button
                  type="button"
                  className="add-cart-button"
                  onClick={() => onAddToCart(product.product_id || product.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductList;