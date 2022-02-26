import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, sitesApi, stockTransferApi } from "../../environments/Api";



const initialState = {
    orders: [],
    currOrder: {},
    status: "idle",
    error: null,
};

export const getAllStockTransfer = createAsyncThunk(
    "stocktransfer/getAllOrders",
    async (currSiteId) => {
        console.log(currSiteId);
        if (currSiteId === 1) { //if by hq then get all stock transfer
            const response = await api.getAll("/sam/stockTransferOrder/all");
            return response.data;
        } else {
            const response = await api.getAll(`/sam/stockTransferOrder/site/${currSiteId}`);
            return response.data;
        }
    }
)

export const getStockTransfer = createAsyncThunk(
    "stocktransfer/getStockTransfer",
    async (id) => {
        const response = await api.get(`sam/stockTransferOrder`, id)
        return response.data
    }
)

export const createStockTransfer = createAsyncThunk(
    "stocktransfer/create",
    async (data) => {
        const response = await api.create(`sam/stockTransferOrder/create/${data.siteId}`, data.order)
        return response.data;
    }
)

export const cancelStockTransfer = createAsyncThunk(
    "stocktransfer/cancel",
    async (data) => {
        const response = await stockTransferApi.cancelOrder(data.orderId, data.siteId)
        return response.data;
    }
)

export const editStockTransfer = createAsyncThunk(
    "stocktransfer/edit",
    async (data) => {
        const response = await stockTransferApi.editOrder(data.order, data.siteId);
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
        builder.addCase(getAllStockTransfer.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(getAllStockTransfer.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.orders = action.payload;
        });
        builder.addCase(getAllStockTransfer.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(getStockTransfer.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(getStockTransfer.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.currOrder = action.payload;
        });
        builder.addCase(getStockTransfer.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(cancelStockTransfer.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(cancelStockTransfer.fulfilled, (state, action) => {
            state.status = "succeeded";
        });
        builder.addCase(cancelStockTransfer.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(editStockTransfer.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(editStockTransfer.fulfilled, (state, action) => {
            state.status = "succeeded";
        });
        builder.addCase(editStockTransfer.rejected, (state, action) => {
            state.status = "failed";
        });
    }
})

export default stocktransferSlice.reducer;

export const selectAllOrders = (state) => state.stocktransfer.orders;

export const selectStockTransferOrder = (state) => state.stocktransfer.currOrder;
