import { PRODUCT_CATEGORIES } from "../utils/constants";

function CategoryNavigation({ onCategoryClick, activeCategory }) {
  return (
    <nav className="category-navigation" aria-label="Product categories">
      <div className="category-title">Categories</div>

      <ul className="category-list">
        {PRODUCT_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <li
              key={category}
              className={`category-item ${isActive ? "active" : ""}`}
              onClick={() => onCategoryClick(category)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onCategoryClick(category)}
            >
              {category}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default CategoryNavigation;