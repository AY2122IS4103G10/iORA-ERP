import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  prodFields: [
    {
      fieldId: 1,
      fieldName: "Color",
      fieldValue: "RED",
    },
    {
      fieldId: 2,
      fieldName: "Color",
      fieldValue: "BLUE",
    },
    {
      fieldId: 3,
      fieldName: "Color",
      fieldValue: "YELLOW",
    },
    {
      fieldId: 4,
      fieldName: "Size",
      fieldValue: "S",
    },
    {
      fieldId: 5,
      fieldName: "Size",
      fieldValue: "M",
    },
    {
      fieldId: 6,
      fieldName: "Size",
      fieldValue: "L",
    },
    {
      fieldId: 7,
      fieldName: "Category",
      fieldValue: "Dress",
    },
    {
      fieldId: 8,
      fieldName: "Category",
      fieldValue: "Shorts",
    },
  ],
  status: "idle",
  error: null,
};

export const fetchProductFields = createAsyncThunk(
  "vouchers/fetchProductFields",
  async () => {
    const response = await api.getAll("productField");
    return response.data;
  }
);

export const addNewProductField = createAsyncThunk(
  "products/addNewPost",
  async (initialVoucher) => {
    const response = await api.create(initialVoucher);
    return response.data;
  }
);

const prodFieldSlice = createSlice({
  name: "prodFields",
  initialState,
  reducers: {
    prodFieldAdded(state, action) {
      state.prodFields.push(action.payload);
    },
  },
});

export const { prodFieldAdded } = prodFieldSlice.actions;

export default prodFieldSlice.reducer;

export const selectAllProdFields = (state) => state.prodFields.prodFields
