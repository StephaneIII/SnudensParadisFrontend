
import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,

    reducers: {
        // Adds a product or increases its quantity
        addToCart: (state, action) => {
            const product = action.payload;

            const existingItem = state.items.find(
                (item) => item.product_id === product.product_id
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }
        },

        // Decreases quantity by 1
        removeFromCart: (state, action) => {
            const product_id = action.payload;

            const existingItem = state.items.find(
                (item) => item.product_id === product_id
            );

            if (!existingItem) return;

            if (existingItem.quantity === 1) {
                state.items = state.items.filter(
                    (item) => item.product_id !== product_id
                );
            } else {
                existingItem.quantity -= 1;
            }
        },

        // Removes an entire product from the cart
        deleteFromCart: (state, action) => {
            const product_id = action.payload;

            state.items = state.items.filter(
                (item) => item.product_id !== product_id
            );
        },

        // Sets a specific quantity
        updateQuantity: (state, action) => {
            const { product_id, quantity } = action.payload;

            const existingItem = state.items.find(
                (item) => item.product_id === product_id
            );

            if (!existingItem || !Number.isInteger(quantity) || quantity < 1) {
                return;
            }

            existingItem.quantity = quantity;
        },

        // Clears the entire cart
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    deleteFromCart,
    updateQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
