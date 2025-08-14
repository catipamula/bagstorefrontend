import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "./ProductCard.css";

const ProductsPage = ({ cartCount, setCartCount }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/products/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok) setProducts(data || []);
        else setError(data.error || "Failed to fetch products");
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("❌ An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCartHandler = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Please login to add items to cart.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/cart/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Product added to cart successfully!");
        // Immediately update cart count
        setCartCount(cartCount + 1);
      } else {
        alert(`❌ Failed to add product: ${data.error}`);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ An error occurred. Please try again.");
    }
  };

  if (loading) return <p>⏳ Loading products...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (products.length === 0) return <p>No products available.</p>;

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          addToCartHandler={addToCartHandler}
        />
      ))}
    </div>
  );
};

export default ProductsPage;
