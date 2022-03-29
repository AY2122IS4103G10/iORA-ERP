import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listingApi } from "../../environments/Api";

const initialState = {
    models: null,
    currModel: null,
    productStock: null,
    status: "idle",
    error: null,
};

export const fetchListings = createAsyncThunk(
    "listings/fetchListings",
    async (data) => {
        if (data.tag === undefined) {
            const response = await listingApi.getListingByLine(data.line);
            return response.data;
        } else {
            const response = await listingApi.getListingByLineAndTag(data.line, data.tag);
            return response.data;
        }
    }
)

export const fetchModel = createAsyncThunk(
    "listings/fetchModel",
    async (modelCode) => {
        const response = await listingApi.getModel(modelCode);
        return response.data;
    }
)

export const fetchProductStock = createAsyncThunk(
    "listings/fetchProductStock",
    async (sku) => {
        const response = await listingApi.getProductStock(sku);
        return response.data;
    }
)

const listingSlice = createSlice({
    name: "listing",
    initialState,
    extraReducers(builder) {
        builder.addCase(fetchListings.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(fetchListings.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.models = action.payload;
        });
        builder.addCase(fetchListings.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
        builder.addCase(fetchModel.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(fetchModel.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.currModel = action.payload;
        });
        builder.addCase(fetchModel.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
        builder.addCase(fetchProductStock.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(fetchProductStock.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.productStock = action.payload;
        });
        builder.addCase(fetchProductStock.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
    },
});

export default listingSlice.reducer;

export const selectListings = (state) => state.listing.models;

export const selectModel = (state) => state.listing.currModel;

export const selectProductStock = (state) => state.listing.productStock;