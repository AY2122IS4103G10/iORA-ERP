import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, sitesApi } from "../../environments/Api"



const initialState = {
    orders: [],
    currOrder: {}, 
    status: "idle", 
    error: null
}

export const getAllStockTransfer = createAsyncThunk(
    "stocktransfer/getAllOrders",
    async () => {
        const response = await api.getAll("/sam/stockTransferOrder/all");
        return response.data;
    }
)

export const createStockTransfer = createAsyncThunk(
    "stocktransfer/create",
    async (data) => {
        const response = await api.create(`sam/stockTransferOrder/create/${data.siteId}`, data.order)
        return response.data;
    }
)


const stocktransferSlice = createSlice({
    name: "stocktransfer",
    initialState,
    extraReducers(builder) {
        builder.addCase(createStockTransfer.pending, (state, action) => {
            state.status = "loading";
          });
        builder.addCase(createStockTransfer.fulfilled, (state, action) => {
        state.status = "succeeded";
        });
        builder.addCase(createStockTransfer.rejected, (state, action) => {
        state.status = "failed";
        });
    }
})

export default stocktransferSlice.reducer;

export const selectAllOrders = (state) => state.stocktransfer.orders;
