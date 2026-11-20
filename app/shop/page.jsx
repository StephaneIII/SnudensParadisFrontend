"use client";

import image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/cartSlice";
import { getUsedAPI } from "../api/BaseUrl";

export default function ShopPage() {
  // Create access to Redux-dispatch
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from the API when the component mounts
  useEffect(() => {
    async function fetchProducts() {
        try {
            const response = await fetch(`${getUsedAPI()}products`);

            if (!response.ok) {
                throw new Error("Kunne ikke hente produkter");
            }
            const data = await response.json();

            setProducts(data.products);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    fetchProducts();
  }, []);

  return (
    <div className="page">
        <h1>Shop Page</h1>
        {loading && <p>Loading products...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        
        {!loading && !error && (
            <div className="product-grid">
                {products.map((product) => (
                    <div className="product-item" key={product.product_id}>
                        <img src={product.image || "/placeholder.png"} alt={product.name} width={250} height={250} />
                        <h2>{product.name}</h2>
                        <p>{product.mærke}</p>
                        <p>Rating: {product.rating || "Not rated"}</p>
                        <p>Price: ${product.price}</p>
                        <button onClick={() => dispatch(addToCart(product))}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
  )
}