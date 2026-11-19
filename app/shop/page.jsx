"use client";

import image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/cartSlice";

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
            const response = await fetch(
                //Placeholder text
            );

            if (!response.ok) {
                throw new Error("Kunne ikke hente produkter");
            }
            const data = await response.json();
            setProducts(data);
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
        {/* Render the product grid */}
        <div className="product-grid">
            {products.map((product) => (
                <div className="product-item" key={product.id}>
                    <img src={product.image} alt={product.name} width={250} height={250} />
                    <h2>{product.name}</h2>
                    <p>{product.brand}</p>
                    <p>Rating: {product.rating || "Not rated"}</p>
                    <p>Price: ${product.price}</p>
                    <button onClick={() => dispatch(addToCart(product))}>
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    </div>
  )
}