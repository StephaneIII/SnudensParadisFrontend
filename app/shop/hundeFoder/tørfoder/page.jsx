"use client";

import image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/cartSlice";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${UsedAPI}products`)

        if (!response.ok) {
          throw new Error("Kunne ikke hente produkter");
        }

        const data = await response.json();

        // Filter products based on their attributes
        const filteredProducts = data.filter((product) =>
          product.attribute?.some(
            (attribute) =>
              attribute.toLowerCase() ===
              category.toLowerCase()
          )
        );

        setProducts(filteredProducts);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="page">
      <h1>
        {category.charAt(0).toUpperCase() +
          category.slice(1)}
      </h1>

      {/* <ProductGrid> */}
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
  );
}