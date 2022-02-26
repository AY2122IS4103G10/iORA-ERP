import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api } from "../../environments/Api";

const initialState = {
    currSiteStock: {
        id: 4,
        productItems: [
            {
              "rfid": "T1ZZ3OA60NOBK18H",
              "available": true,
              "productSKU": "AKV0010057J-1",
              "stockLevel": null
          },
          {
            "rfid": "NJCTRE9HI281F8B7",
            "available": true,
            "productSKU": "AKV0010057J-2",
            "stockLevel": null
          },
          {
            "rfid": "1HAC5IJD2Y8R2X4G",
            "available": true,
            "productSKU": "AKV0010057J-3",
            "stockLevel": null
          },
        ],
        products: {
          "AKV0010057J-1": 1,
          "AKV0010057J-2": 2,
          "AKV0010057J-3": 3, 
        },
        models: {
          "AKV0010057J": 6,
        },
        reserveProducts: {
          "AKV0010057J-2": 1
        }
    },
    status: "idle",
    error: null
};

export const getASiteStock = createAsyncThunk(
    "stocklevels/getASiteStock",
    async (id) => {
      const response = await api.get(`/store/viewStock/sites`, id);
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
      
    }
});

export default stocklevelSlice.reducer;

export const selectCurrSiteStock = (state) => state.stocklevel.currSiteStock;