import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../api/api";
import "./Home.css";

const Home = ({ updateCart, cartCount, setCartCount }) => {
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const addToCartHandler = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Please login to add items to cart.");
      return;
    }

    try {
      console.log("Adding product to cart:", productId); // Debug log
      
      // Try different cart endpoint patterns
      const res = await fetch("http://127.0.0.1:8000/api/cart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });

      const data = await res.json();
      console.log("Add to cart response:", data); // Debug log
      
      if (res.ok) {
        alert("✅ Product added to cart successfully!");
        
        // Fetch updated cart data
        const cartRes = await fetch("http://127.0.0.1:8000/api/cart/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const cartData = await cartRes.json();
        console.log("Updated cart data:", cartData); // Debug log
        
        if (cartRes.ok) {
          // Handle different possible cart data structures
          let processedCartData = [];
          if (cartData.cart) {
            processedCartData = cartData.cart;
          } else if (cartData.items) {
            processedCartData = cartData.items;
          } else if (Array.isArray(cartData)) {
            processedCartData = cartData;
          } else if (cartData.results) {
            processedCartData = cartData.results;
          }
          
          console.log("Processed cart data for update:", processedCartData); // Debug log
          updateCart(processedCartData);
          setCartCount(processedCartData.length);
        }
      } else {
        alert(`❌ Failed to add product: ${data.error || data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ An error occurred. Please try again.");
    }
  };

  const filteredProducts = products
    .filter(p => categoryFilter === "all" ? true : p.category === categoryFilter)
    .sort((a, b) => {
      if (sortOption === "price_low") return a.price - b.price;
      if (sortOption === "price_high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="home-container">
      <div className="filters">
        <select onChange={e => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="backpack">Backpacks</option>
          <option value="handbag">Handbags</option>
          <option value="wallet">Wallets</option>
        </select>
        <select onChange={e => setSortOption(e.target.value)}>
          <option value="default">Default</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            addToCartHandler={addToCartHandler}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
