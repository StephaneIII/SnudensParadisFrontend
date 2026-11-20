
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./cart.css";

import {
    addToCart,
    removeFromCart,
    deleteFromCart,
    updateQuantity,
    clearCart,
} from "../../redux/cartSlice";

import { getUsedAPI } from "../api/BaseUrl";

export default function CartPage() {
    const cartItems = useSelector((state) => state.cart.items);
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [orderSummary, setOrderSummary] = useState(null);

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

        const userId = user.uid ?? user.userID ?? user.id;

        if (!userId) {
            setMessage("Could not find your user ID.");
            return;
        }

        if (cartItems.length === 0) {
            setMessage("Your cart is empty.");
            return;
        }

        setLoading(true);
        setMessage("");

        // Convert cart items to API format
        const orderItems = cartItems.map((item) => ({
            product_id: item.product_id,
            amount: item.quantity,
        }));

        try {
            const response = await fetch(`${getUsedAPI()}orders/${userId}`, {
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

            // Save order information before clearing cart
            setOrderSummary({
                order: data,
                items: [...cartItems],
                total: totalPrice,
                date: new Date().toLocaleString(),
            });

            // Clear cart only after successful order creation
            dispatch(clearCart());

            setMessage("");

        } catch (error) {
            setMessage(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    // Order confirmation
    if (orderSummary) {
        return (
            <div className="page cart-page">
                <div className="order-confirmation">
                    <div className="confirmation-icon">✓</div>

                    <h1>Thank you for your order!</h1>

                    <p className="confirmation-message">
                        Your order has been placed successfully.
                    </p>

                    <div className="order-summary">
                        <h2>Order Summary</h2>

                        <p>
                            <strong>Order ID:</strong>{" "}
                            {orderSummary.order.order_id ??
                                orderSummary.order.id ??
                                "Created"}
                        </p>

                        <p>
                            <strong>Date:</strong> {orderSummary.date}
                        </p>

                        <div className="order-summary-items">
                            {orderSummary.items.map((item) => (
                                <div
                                    className="order-summary-item"
                                    key={item.product_id}
                                >
                                    <img
                                        src={item.image || "/placeholder.png"}
                                        alt={item.name}
                                    />

                                    <div>
                                        <h3>{item.name}</h3>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>
                                            $
                                            {(
                                                Number(item.price) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-summary-total">
                            <strong>Total</strong>
                            <strong>
                                ${orderSummary.total.toFixed(2)}
                            </strong>
                        </div>
                    </div>

                    <button
                        className="confirm-button"
                        onClick={() => setOrderSummary(null)}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
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
