import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductDetails, addToCart } from "../api/api";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const data = await fetchProductDetails(id);
    setProduct(data);
  };

  const addToCartHandler = async () => {
    try {
      const res = await addToCart(product.id);
      alert(res.message);
    } catch (error) {
      alert("Failed to add to cart. Login first.");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details">
      <img src={`http://127.0.0.1:8000${product.image}`} alt={product.name} />
      <div className="details">
        <h2>{product.name}</h2>
        <p>Category: {product.category}</p>
        <p>Price: ₹{product.price}</p>
        <p>{product.description}</p>
        <button onClick={addToCartHandler}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetails;
