import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  promotions: [],
  status: "idle",
  error: null,
};

export const fetchPromotions = createAsyncThunk(
  "promotions/fetchPromotions",
  async () => {
    const response = await api.getAll("sam/promotionFields");
    return response.data;
  }
);

export const addNewPromotion = createAsyncThunk(
  "promotions/addNewPromotion",
  async (initialProduct) => {
    const response = await api.create("sam/promoField", initialProduct);
    return response.data;
  }
);

export const updateExistingPromotion = createAsyncThunk(
  "promotions/updateExistingPromotion",
  async (existingPromotion) => {
    const response = await api.update("sam/promoField", existingPromotion);
    return response.data;
  }
);

export const deleteExistingPromotion = createAsyncThunk(
  "promotions/deleteExistingPromotion",
  async (existingPromoId) => {
    const response = await api.delete("promotion", existingPromoId);
    return response.data;
  }
);

const promotionsSlice = createSlice({
  name: "promotions",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchPromotions.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchPromotions.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.promotions = state.promotions.concat(action.payload);
    });
    builder.addCase(fetchPromotions.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewPromotion.fulfilled, (state, action) => {
      state.promotions.push(action.payload);
    });
    builder.addCase(updateExistingPromotion.fulfilled, (state, action) => {
      const { id, fieldName, fieldValue, discountedPrice } = action.payload;
      const existingProd = state.promotions.find(
        (promo) => promo.id === id
      );
      if (existingProd) {
        existingProd.fieldName = fieldName;
        existingProd.fieldValue = fieldValue;
        existingProd.discountedPrice = discountedPrice;
      }
    });
    builder.addCase(deleteExistingPromotion.fulfilled, (state, action) => {
      state.promotions = state.promotions.filter(
        ({ id }) => id !== action.payload.id
      );
    });
  },
});

export default promotionsSlice.reducer;

export const selectAllPromotions = (state) => state.promotions.promotions;

export const selectPromotionById = (state, id) =>
  state.promotions.promotions.find((promo) => promo.id === id);
