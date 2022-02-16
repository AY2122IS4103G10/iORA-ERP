import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { sitesApi } from "../../environments/Api";

const initialState = {
    sites: [
        {
            id: 1,
            siteCode: "ICO",
            name: "iORA Compass One",
            company: {
                id: 1,
                name: "iORA Singapore"
            },
        },
        {
            id: 2,
            siteCode: "IOI",
            name: "iORA IOI Mall",
            company: {
                id: 2,
                name: "iORA Malaysia"
            },
        },
        {
            id: 3,
            siteCode: "A544",
            name: "Lalu Junction 8",
            company: {
                id: 1,
                name: "iORA Singapore"
            },
        },
    ],
    status: "idle",
    error: null,
};

export const fetchSites = createAsyncThunk(
    "stocklevels/fetchSites",
    async () => {
        const response = await sitesApi.getAll();
        console.log(response.data);
        return response.data;
    }
)

const siteSlice = createSlice({
    name: "sites",
    initialState,
    reducer: {
        ignore(state, action) {

        },
        extraReducers: (builder) => {
            builder.addCase(fetchSites.pending, (state, action) => {
              state.status = "loading";
            });
            builder.addCase(fetchSites.fulfilled, (state, action) => {
              state.status = "succeeded";
              state.products = state.sites.concat(action.payload);
            });
            builder.addCase(fetchSites.rejected, (state, action) => {
              state.status = "failed";
            });
        },
    }
})
export const selectAllSites = (state) => state.sites.sites;

export default siteSlice.reducer;
