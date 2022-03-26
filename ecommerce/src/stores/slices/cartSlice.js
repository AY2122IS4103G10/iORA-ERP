import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
    delivery: true,
    status: "idle",
    error: null,
}

const cartSlice = createSlice({
    name: "cart", 
    initialState,
    reducers: {
        addToCart(state, action) {
            const {model, product} = action.payload;
            //check if product has been added
            if (state.cart.some((item) => item?.product.sku === product.sku )) {
                state.cart = state.cart.map((item) => {

                    if (item.product.sku === product.sku) {
                        return {
                            ...item,
                            qty: item.qty + 1
                        }
                    } else {
                        return {...item};
                    }
                })
            } else {
                state.cart = state.cart.concat({model: model, product: product, qty: 1});
            }
        },
        addCartItemQty(state, action) {
            const product = action.payload;
            state.cart = state.cart.map((item) => {
                if (item.product.sku === product.sku) {
                    return {
                        ...item,
                        qty: item.qty + 1
                    }
                } else {
                    return {...item};
                }
            })
        },
        minusCartItemQty(state, action) {
            const product = action.payload;
            state.cart = state.cart.map((item) => {
                if (item.product.sku === product.sku) {
                    return {
                        ...item,
                        qty: item.qty > 1 ? item.qty - 1 : 1
                    }
                } else {
                    return {...item};
                }
            })
        },
        removeItemFromCart(state, action) {
            const product = action.payload;
            state.cart = state.cart.filter((item) => item.product.sku !== product.sku);
        }, 
        setDeliveryChoice(state, action) {
            state.delivery = action.payload;
        }
    },
})

export const { 
    addCartItemQty, 
    minusCartItemQty, 
    addToCart, 
    removeItemFromCart, 
    setDeliveryChoice } = cartSlice.actions;

export default cartSlice.reducer;

export const selectCart = (state) => state.cart.cart;

export const selectCartQty = (state) => {
    let count = 0;
    const cart = state.cart.cart;
    cart.forEach((item) => count = count + item.qty);
    return count;
};