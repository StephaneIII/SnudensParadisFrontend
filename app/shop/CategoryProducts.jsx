"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { getUsedAPI } from "../api/BaseUrl";

export default function CategoryProducts({ category }) {
  const dispatch = useDispatch();
  const [result, setResult] = useState({ category: null, products: [], error: null });
  const loading = result.category !== category;

  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      try {
        const response = await fetch(`${getUsedAPI()}products`);
        if (!response.ok) {
          throw new Error(`Kunne ikke hente produkter (HTTP ${response.status}).`);
        }

        const data = await response.json();
        const allProducts = Array.isArray(data) ? data : data?.products;
        if (!Array.isArray(allProducts)) {
          throw new Error("Produkttjenesten returnerede et ugyldigt svar.");
        }

        const filteredProducts = allProducts.filter((product) => {
          const matchesCategory = (value) =>
            typeof value === "string" && value.toLowerCase() === category.toLowerCase();

          return (
            (Array.isArray(product?.attribute_values) &&
              product.attribute_values.some((attribute) => matchesCategory(attribute?.value))) ||
            (Array.isArray(product?.attribute) && product.attribute.some(matchesCategory))
          );
        });

        if (active) setResult({ category, products: filteredProducts, error: null });
      } catch (err) {
        if (active) setResult({ category, products: [], error: err.message });
      }
    }

    fetchProducts();
    return () => { active = false; };
  }, [category]);

  return (
    <div className="page">
      <h1>{category}</h1>
      {loading && <p>Indlæser produkter...</p>}
      {!loading && result.error && <p role="alert">{result.error}</p>}
      {!loading && !result.error && result.products.length === 0 && <p>Ingen produkter fundet.</p>}
      {!loading && !result.error && (
        <div className="product-grid">
          {result.products.map((product) => (
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
