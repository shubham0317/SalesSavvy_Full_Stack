import React from "react";

function CategoryNavigation({
  onCategoryClick
}) {

  const categories = [
    "Shirts",
    "Pants",
    "Accessories",
    "Mobiles",
    "Mobile Accessories"
  ];

  return (

    <nav className="category-navigation">

      <div className="category-title">
        Categories
      </div>

      <ul className="category-list">

        {categories.map(
          (category, index) => (

            <li
              key={index}
              className="category-item"
              onClick={() =>
                onCategoryClick(category)
              }
            >
              {category}
            </li>

          )
        )}

      </ul>

    </nav>
  );
}

export default CategoryNavigation;