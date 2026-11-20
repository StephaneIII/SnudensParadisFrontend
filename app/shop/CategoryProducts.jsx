
"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { getUsedAPI } from "../api/BaseUrl";
import "./product.css";

export default function CategoryProducts({ category }) {
    const dispatch = useDispatch();

    const [result, setResult] = useState({
        category: null,
        products: [],
        error: null,
    });

    const loading = result.category !== category;

    // Fetch and filter products based on category
    useEffect(() => {
        let active = true;

        async function fetchProducts() {
            try {
                const response = await fetch(`${getUsedAPI()}products`);

                if (!response.ok) {
                    throw new Error(
                        `Could not fetch products (HTTP ${response.status}).`
                    );
                }

                const data = await response.json();

                const allProducts = Array.isArray(data)
                    ? data
                    : data?.products;

                if (!Array.isArray(allProducts)) {
                    throw new Error("Invalid response from product API.");
                }

                // Filter products by their attributes
                const filteredProducts = allProducts.filter((product) => {
                    const matchesCategory = (value) =>
                        typeof value === "string" &&
                        value.toLowerCase() === category.toLowerCase();

                    return (
                        (Array.isArray(product?.attribute_values) &&
                            product.attribute_values.some((attribute) =>
                                matchesCategory(attribute?.value)
                            )) ||
                        (Array.isArray(product?.attribute) &&
                            product.attribute.some(matchesCategory))
                    );
                });

                if (active) {
                    setResult({
                        category,
                        products: filteredProducts,
                        error: null,
                    });
                }
            } catch (err) {
                if (active) {
                    setResult({
                        category,
                        products: [],
                        error: err.message,
                    });
                }
            }
        }

        fetchProducts();

        return () => {
            active = false;
        };
    }, [category]);

    return (
        <div className="page product-page">
            <div className="shop-header">
                <h1>{category}</h1>
                <p>Browse products in this category.</p>
            </div>

            {loading && (
                <p className="shop-message">Loading products...</p>
            )}

            {!loading && result.error && (
                <p className="shop-error" role="alert">
                    {result.error}
                </p>
            )}

            {!loading && !result.error && result.products.length === 0 && (
                <p className="shop-message">
                    No products found in this category.
                </p>
            )}

            {!loading && !result.error && result.products.length > 0 && (
                <div className="product-grid">
                    {result.products.map((product) => (
                        <div
                            className="product-card"
                            key={product.product_id}
                        >
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
                                        onClick={() =>
                                            dispatch(addToCart(product))
                                        }
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
