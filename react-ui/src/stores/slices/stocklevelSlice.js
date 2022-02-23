import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api } from "../../environments/Api";

const initialState = {
    currSiteStock: {
        id: 4,
        productItems: [
            {
              "rfid": "T1ZZ3OA60NOBK18H",
              "available": true,
              "productSKU": "ASK0009968A-1",
              // "stockLevel": null
          },
          {
            "rfid": "NJCTRE9HI281F8B7",
            "available": true,
            "productSKU": "ASK0009968A-2",
            // "stockLevel": null
          },
          {
            "rfid": "1HAC5IJD2Y8R2X4G",
            "available": true,
            "productSKU": "ASK0009968A-3",
            // "stockLevel": null/
          },
        ],
        products: {
          "ASK0009968A-1": 1,
          "ASK0009968A-2": 2,
          "ASK0009968A-3": 3, 
        },
        models: {
          "ASK0009968A": 6,
        },
        reserveProducts: {
          "ASK0009968A-1": 1
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