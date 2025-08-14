import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart count from localStorage or update global state
    // This will be handled by the parent App component when it detects cart is empty
  }, []);

  return (
    <div className="order-success">
      <div className="success-content">
        <h2>🎉 Thank you! Your order has been placed successfully!</h2>
        <p>You will receive an email confirmation shortly.</p>

      </div>
    </div>
  );
};

export default OrderSuccess;
