import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, addToCartHandler }) => {
  return (
    <div className="product-card">
      <img
        src={product.image ? `http://127.0.0.1:8000${product.image}` : "/default-image.png"}
        alt={product.name}
      />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      {product.category && <p className="category">{product.category}</p>}
      <button onClick={() => addToCartHandler(product.id)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
