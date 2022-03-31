import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { sitesApi } from "../../environments/Api";

const initialState = {
  stockLevelSites: [],
  stockLevelProducts: [],
  status: "idle",
  error: null,
};

const dashboardSlice = createSlice({
  name: "customers",
  initialState,
  extraReducers(builder) {
    builder.addCase(getStockLevelSites.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getStockLevelSites.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.stockLevelSites = action.payload;
    });
    builder.addCase(getStockLevelSites.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export default dashboardSlice.reducer;

export const getStockLevelSites = createAsyncThunk(
  "dashboard/getStockLevelSites",
  async () => {
    const response = await sitesApi.getAll();
    return response.data;
  }
);
