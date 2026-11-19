"use client";

import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/cartSlice";

export default function ShopPage() {
  // Create access to Redux-dispatch
  const dispatch = useDispatch();

  return (
    <div className="page">
        <h1>Shop Page</h1>
        {/* Render the product grid */}
        <div className="product-grid">
            {/* product placement*/}
        </div>
    </div>
  )
}