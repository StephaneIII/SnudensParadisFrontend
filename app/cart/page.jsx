
"use client";

import { useDispatch, useSelector } from "react-redux";

import {
    addToCart,
    removeFromCart,
    deleteFromCart,
    updateQuantity,
    clearCart,
} from "../../redux/cartSlice";

export default function CartPage() {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();

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
                                                const quantity = Number(e.target.value);

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
                                            Number(item.price) * item.quantity
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
                                disabled
                            >
                                Checkout (coming next)
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
