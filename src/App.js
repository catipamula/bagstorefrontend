import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPages from './pages/LandingPage'; // Make sure this file exists
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import OrdersPlaced from "./pages/OrdersPlaced"; // if in src/pages/

// Component to handle cart clearing on route changes
const CartManager = ({ updateCart, setCartCount }) => {
  const location = useLocation();

  useEffect(() => {
    // Clear cart when navigating to order success page
    if (location.pathname === '/ordersuccess') {
      updateCart([]);
      setCartCount(0);
    }
  }, [location.pathname, updateCart, setCartCount]);

  return null;
};

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart data on app load
  useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("http://127.0.0.1:8000/api/cart/", {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          const data = await res.json();
          console.log("Cart API Response:", data); // Debug log
          
          if (res.ok) {
            // Handle different possible cart data structures
            let cartData = [];
            if (data.cart) {
              cartData = data.cart;
            } else if (data.items) {
              cartData = data.items;
            } else if (Array.isArray(data)) {
              cartData = data;
            } else if (data.results) {
              cartData = data.results;
            }
            
            console.log("Processed cart data:", cartData); // Debug log
            setCartItems(cartData);
            setCartCount(cartData.length);
          } else {
            console.error("Failed to fetch cart:", data);
          }
        } catch (err) {
          console.error("Error fetching cart:", err);
        }
      }
    };

    fetchCartData();
  }, []);

  // Function to update cart state
  const updateCart = (newCartItems) => {
    console.log("Updating cart with:", newCartItems); // Debug log
    setCartItems(newCartItems);
    setCartCount(newCartItems.length);
  };

  return (
    <Router>
      <CartManager updateCart={updateCart} setCartCount={setCartCount} />
      <Navbar cartCount={cartCount} />
      <div className="container">
        <Routes>
          {/* Landing page for all users */}
          <Route path="/" element={<LandingPages />} />

          {/* Products page after login */}
          <Route path="/home" element={<Home updateCart={updateCart} cartCount={cartCount} setCartCount={setCartCount} />} />

          {/* Product details page */}
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Cart and checkout pages */}
          <Route path="/cart" element={<Cart cartItems={cartItems} updateCart={updateCart} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ordersuccess" element={<OrderSuccess />} />
          <Route path="/orders-placed" element={<OrdersPlaced />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
