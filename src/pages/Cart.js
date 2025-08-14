import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = ({ cartItems, updateCart }) => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Calculate total whenever cartItems change
  useEffect(() => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  }, [cartItems]);

  // Refresh cart data when component mounts
  useEffect(() => {
    refreshCartData();
  }, []);

  const refreshCartData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view cart.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/cart/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await res.json();
      console.log("Cart page - Cart API Response:", data); // Debug log
      
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
        
        console.log("Cart page - Processed cart data:", cartData); // Debug log
        updateCart(cartData);
      } else {
        console.error("Failed to fetch cart:", data);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  // Remove item and update parent state
  const removeItem = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to manage cart items.");
      return;
    }

    console.log("Attempting to remove item:", item); // Debug log

    try {
      // Try different possible ID structures for deletion
      let deleteId = null;
      
      // First try cart item ID if it exists
      if (item.id) {
        deleteId = item.id;
      } else if (item.cart_item_id) {
        deleteId = item.cart_item_id;
      } else if (item.product && item.product.id) {
        deleteId = item.product.id;
      }
      
      console.log("Using delete ID:", deleteId); // Debug log
      
      if (!deleteId) {
        alert("Cannot identify item to remove. Please try refreshing the cart.");
        return;
      }

      // Try different delete endpoint patterns
      const deleteEndpoints = [
        `http://127.0.0.1:8000/api/cart/${deleteId}/`,
        `http://127.0.0.1:8000/api/cart/remove/${deleteId}/`,
        `http://127.0.0.1:8000/api/cart-item/${deleteId}/`,
        `http://127.0.0.1:8000/api/cart-items/${deleteId}/`
      ];

      let deleteSuccess = false;
      let lastError = null;

      for (const endpoint of deleteEndpoints) {
        try {
          console.log("Trying delete endpoint:", endpoint); // Debug log
          
          const res = await fetch(endpoint, {
            method: "DELETE",
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          
          console.log("Delete response status:", res.status); // Debug log
          
          if (res.ok) {
            console.log("Item removed successfully from:", endpoint); // Debug log
            deleteSuccess = true;
            break;
          } else {
            const errorData = await res.json().catch(() => ({}));
            console.log("Delete failed for endpoint:", endpoint, errorData); // Debug log
            lastError = errorData;
          }
        } catch (err) {
          console.log("Error with endpoint:", endpoint, err); // Debug log
          lastError = err;
        }
      }

      if (deleteSuccess) {
        // Refresh cart data after removal
        await refreshCartData();
      } else {
        console.error("All delete endpoints failed:", lastError); // Debug log
        alert(`Failed to remove item from cart. Please try refreshing the cart.`);
      }
    } catch (err) {
      console.error("Error removing item:", err);
      alert("An error occurred while removing the item.");
    }
  };

  const goToCheckout = () => {
    navigate("/checkout", { state: { cartItems, total } });
  };

  if (loading) {
    return (
      <div className="cart-container">
        <h2>My Cart</h2>
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>My Cart</h2>
        <button onClick={refreshCartData} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>
      
      {cartItems.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          {/* <button onClick={() => navigate("/home")}>Continue Shopping</button> */}
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id || item.product?.id} className="cart-item">
                <span>{item.product?.name || item.name}</span>
                <span>Qty: {item.quantity}</span>
                <span>₹{(item.product?.price || item.price) * item.quantity}</span>
                <button onClick={() => removeItem(item)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: ₹{total}</h3>
          <button onClick={goToCheckout}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;
