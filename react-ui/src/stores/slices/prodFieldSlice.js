import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  prodFields: [],
  status: "idle",
  error: null,
};

export const fetchProductFields = createAsyncThunk(
  "productFields/fetchProductFields",
  async () => {
    const response = await api.getAll("sam/productField");
    return response.data;
  }
);

export const addNewProductField = createAsyncThunk(
  "productFields/addNewProductField",
  async (initialProductField) => {
    const response = await api.create("sam/productField", initialProductField);
    return response.data;
  }
);

const prodFieldSlice = createSlice({
  name: "prodFields",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchProductFields.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchProductFields.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.prodFields = action.payload;
    });
    builder.addCase(fetchProductFields.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewProductField.fulfilled, (state, action) => {
      state.prodFields.push(action.payload)
      state.status = "success";
    });
  },
});

export default prodFieldSlice.reducer;

export const selectAllProdFields = (state) => state.prodFields.prodFields;

export const selectProdFieldById = (state, id) =>
  state.prodFields.prodFields.find((prodField) => prodField.id === id);