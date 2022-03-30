import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { purchasesApi } from "../../environments/Api";

const initialState = {
    purchase: null,
    purchaseList: null,
    status: "idle",
    error: null,
}

export const fetchPurchase = createAsyncThunk(
    "purchases/fetchPurchase",
    async (id) => {
        const response = await purchasesApi.getOrder(id);
        return response.data;
    }
)

const purchasesSlice = createSlice({
    name: "purchases",
    initialState,
    reducers: {
        orderSuccess(state, action) {
            state.purchase = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchPurchase.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(fetchPurchase.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.purchase = action.payload;
        });
        builder.addCase(fetchPurchase.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
    }
})

export default purchasesSlice.reducer;

export const { orderSuccess } = purchasesSlice.actions;

export const selectPurchase = (state) => state.purchases.purchase; 