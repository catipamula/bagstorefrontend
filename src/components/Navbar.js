import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import bagLogo from "../assets/shopping-bag.png"; // Logo in src/assets/

const Navbar = ({ cartCount = 0 }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <Link to="/" className="logo-link">
          <img src={bagLogo} alt="BagStore" className="logo-img" />
          <span className="logo-text">Store</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        {token ? (
          <>
            <li><Link to="/home">Products</Link></li>
            <li>
              <Link to="/cart" className="cart-link">
                Cart
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
            </li>
            <li><Link to="/orders-placed">Your Orders</Link></li>
            {/* <li><Link to="/checkout">Checkout</Link></li> */}
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
