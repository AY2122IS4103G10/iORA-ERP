import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listingApi } from "../../environments/Api";

const initialState = {
    models: null, 
    currModel: null,
    currProduct: null,
    status: "idle",
    error: null,
};

export const fetchListings = createAsyncThunk(
    "listings/fetchListings",
    async (data) => {
        const response = await listingApi.getListing(data.line, data.tag);
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
    },
});

export default listingSlice.reducer;

export const selectListings = (state) => state.listing.models;