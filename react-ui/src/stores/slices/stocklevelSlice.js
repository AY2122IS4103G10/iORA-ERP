import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api, stockLevelApi } from "../../environments/Api";

const initialState = {
  currSiteStock: {},
  prodStockLevel: {},
  status: "idle",
  error: null
};

export const getASiteStock = createAsyncThunk(
  "stocklevels/getASiteStock",
  async (id) => {
    const response = await api.get(`store/viewStock/sites`, id);
    return response.data;
  }
);

export const editStock = createAsyncThunk(
  "stocklevels/editStock",
  async (data) => {
    const response = await stockLevelApi.editStock(data.toUpdate, data.siteId);
    return response.data;
  }
);

//get product's stock level
export const getProductStockLevel = createAsyncThunk(
  "products/getProductStockLevel",
  async (sku) => {
    const response = await api.get(`sam/viewStock/product`, sku);
    return response.data;
  }
);

const stocklevelSlice = createSlice({
  name: "stocklevel",
  initialState,
  extraReducers(builder) {
    builder.addCase(getASiteStock.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getASiteStock.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.currSiteStock = action.payload;
    });
    builder.addCase(getASiteStock.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(getProductStockLevel.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getProductStockLevel.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.prodStockLevel = action.payload;
    });
    builder.addCase(getProductStockLevel.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(editStock.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(editStock.fulfilled, (state, action) => {
      state.status = "succeeded";
    });
    builder.addCase(editStock.rejected, (state, action) => {
      state.status = "failed";
    });

  }
});

export default stocklevelSlice.reducer;

export const selectCurrSiteStock = (state) => state.stocklevel.currSiteStock;

export const selectProductStock = (state) => state.stocklevel.prodStockLevel;