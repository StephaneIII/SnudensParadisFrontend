
"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { getUsedAPI } from "../api/BaseUrl";
import "./product.css";
import "../globals.css";

export default function ShopPage() {
    const dispatch = useDispatch();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products from API
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(`${getUsedAPI()}products`);

                if (!response.ok) {
                    throw new Error("Could not fetch products.");
                }

                const data = await response.json();

                setProducts(Array.isArray(data) ? data : data.products);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    return (
        <div className="page product-page">
            <div className="shop-header">
                <h1>Our Shop</h1>
                <p>Browse our collection of products.</p>
            </div>

            {loading && (
                <p className="shop-message">Loading products...</p>
            )}

            {error && (
                <p className="shop-error">Error: {error}</p>
            )}

            {!loading && !error && products.length === 0 && (
                <p className="shop-message">No products available.</p>
            )}

            {!loading && !error && (
                <div className="product-grid">
                    {products.map((product) => (
                        <div className="product-card" key={product.product_id}>
                            <div className="product-image">
                                <img
                                    src={product.image || "/placeholder.png"}
                                    alt={product.name}
                                />
                            </div>

                            <div className="product-info">
                                <p className="product-brand">
                                    {product.mærke}
                                </p>

                                <h2>{product.name}</h2>

                                <p className="product-rating">
                                    Rating: {product.rating || "Not rated"}
                                </p>

                                <div className="product-footer">
                                    <strong className="product-price">
                                        ${Number(product.price).toFixed(2)}
                                    </strong>

                                    <button
                                        className="add-to-cart-button"
                                        onClick={() => dispatch(addToCart(product))}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
