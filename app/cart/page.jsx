
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addToCart,
    removeFromCart,
    deleteFromCart,
    updateQuantity,
    clearCart,
} from "../../redux/cartSlice";

import { UsedAPI } from "../api/BaseUrl";

export default function CartPage() {
    const cartItems = useSelector((state) => state.cart.items);
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Calculate total price
    const totalPrice = cartItems.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
    );

    // Calculate total number of items
    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // Checkout
    async function handleCheckout() {
        if (!token || !user) {
            setMessage("Please log in before checking out.");
            return;
        }

        // Support the different user ID field names
        const userId = user.uid ?? user.userID ?? user.id;

        if (!userId) {
            setMessage("Could not find your user ID.");
            return;
        }

        setLoading(true);
        setMessage("");

        // Convert cart items to the API format
        const orderItems = cartItems.map((item) => ({
            product_id: item.product_id,
            amount: item.quantity,
        }));

        try {
            const response = await fetch(`${UsedAPI}orders/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    items: orderItems,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Could not create your order."
                );
            }

            // Clear cart only after successful order creation
            dispatch(clearCart());

            setMessage("Order created successfully!");
            
        } catch (error) {
            setMessage(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page cart-page">
            <h1>Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <p>
                        You have {totalItems} item
                        {totalItems !== 1 ? "s" : ""} in your cart.
                    </p>

                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div
                                className="cart-item"
                                key={item.product_id}
                            >
                                <img
                                    src={item.image || "/placeholder.png"}
                                    alt={item.name}
                                />

                                <div className="cart-item-details">
                                    <h2>{item.name}</h2>

                                    <p>
                                        Price: $
                                        {Number(item.price).toFixed(2)}
                                    </p>

                                    <div className="quantity-controls">
                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    removeFromCart(item.product_id)
                                                )
                                            }
                                        >
                                            -
                                        </button>

                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const quantity = Number(
                                                    e.target.value
                                                );

                                                if (
                                                    Number.isInteger(quantity) &&
                                                    quantity >= 1
                                                ) {
                                                    dispatch(
                                                        updateQuantity({
                                                            product_id: item.product_id,
                                                            quantity,
                                                        })
                                                    );
                                                }
                                            }}
                                        />

                                        <button
                                            onClick={() =>
                                                dispatch(addToCart(item))
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="cart-item-right">
                                    <strong>
                                        $
                                        {(
                                            Number(item.price) *
                                            item.quantity
                                        ).toFixed(2)}
                                    </strong>

                                    <button
                                        className="remove-button"
                                        onClick={() =>
                                            dispatch(
                                                deleteFromCart(item.product_id)
                                            )
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Total: ${totalPrice.toFixed(2)}</h2>

                        <div className="cart-buttons">
                            <button
                                className="clear-button"
                                onClick={() => dispatch(clearCart())}
                            >
                                Empty Cart
                            </button>

                            <button
                                className="confirm-button"
                                onClick={handleCheckout}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Checkout"}
                            </button>
                        </div>

                        {message && <p role="status">{message}</p>}
                    </div>
                </>
            )}
        </div>
    );
}
