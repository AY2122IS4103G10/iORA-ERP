import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
    status: "idle",
    error: null,
}

const cartSlice = createSlice({
    name: "cart", 
    initialState,
    reducers: {
        addToCart(state, action) {
            const newProduct = action.payload;
            //check if product has been added
            if (state.cart.some((item) => item?.product.sku === newProduct.sku )) {
                state.cart = state.cart.map((item) => {

                    if (item.product.sku === newProduct.sku) {
                        return {
                            ...item,
                            qty: item.qty + 1
                        }
                    } else {
                        return {...item};
                    }
                })
            } else {
                state.cart = state.cart.concat({product: newProduct, qty: 1});
            }
        }
    },
})

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;