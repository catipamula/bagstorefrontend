import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/"; // Django backend

const getAuthToken = () => localStorage.getItem("token") || "";

export const fetchProducts = async () => {
  const res = await axios.get(`${API_URL}products/`);
  return res.data;
};

export const fetchProductDetails = async (id) => {
  const res = await axios.get(`${API_URL}products/${id}/`);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}register/`, userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await axios.post(`${API_URL}login/`, credentials);
  return res.data;
};

export const addToCart = async (product_id, quantity = 1) => {
  const res = await axios.post(
    `${API_URL}cart/`,
    { product_id, quantity },
    { headers: { Authorization: `Token ${getAuthToken()}` } }
  );
  return res.data;
};

export const fetchCart = async () => {
  const res = await axios.get(`${API_URL}cart/`, {
    headers: { Authorization: `Token ${getAuthToken()}` },
  });
  return res.data;
};

export const removeFromCart = async (id) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token");
  }

  // Try different delete endpoint patterns
  const deleteEndpoints = [
    `${API_URL}cart/${id}/`,
    `${API_URL}cart/remove/${id}/`,
    `${API_URL}cart-item/${id}/`,
    `${API_URL}cart-items/${id}/`
  ];

  let lastError = null;

  for (const endpoint of deleteEndpoints) {
    try {
      console.log("API: Trying delete endpoint:", endpoint); // Debug log
      
      const res = await axios.delete(endpoint, {
        headers: { Authorization: `Token ${token}` },
      });
      
      console.log("API: Delete successful from:", endpoint); // Debug log
      return res.data;
    } catch (err) {
      console.log("API: Delete failed for endpoint:", endpoint, err.response?.status); // Debug log
      lastError = err;
    }
  }

  // If all endpoints failed, throw the last error
  throw lastError || new Error("Failed to remove item from cart");
};

export const checkoutCart = async (checkoutData) => {
  const res = await axios.post(`${API_URL}checkout/`, checkoutData, {
    headers: { Authorization: `Token ${getAuthToken()}` },
  });
  return res.data;
};

export const passwordResetRequest = async (email) => {
  const res = await axios.post(`${API_URL}password-reset/`, { email });
  return res.data;
};

export const passwordResetConfirm = async (data) => {
  const res = await axios.post(`${API_URL}password-reset-confirm/`, data);
  return res.data;
};

export const placeOrder = async (orderData) => {
  try {
    const res = await axios.post(`${API_URL}orders`, orderData);
    return res.data;
  } catch (err) {
    console.error("Error placing order:", err.response?.data || err.message);
    return { success: false, error: err.message };
  }
};