import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  products: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await api.getAll("model");
    return response.data;
  }
);

export const addNewProduct = createAsyncThunk(
  "products/addNewPost",
  async (initialProduct) => {
    const response = await api.create("model", initialProduct);
    return response.data;
  }
);

export const updateExistingProduct = createAsyncThunk(
  "products/updateExistingProduct",
  async (existingProduct) => {
    const response = await api.update(
      "model",
      existingProduct.modelCode,
      existingProduct
    );
    return response.data;
  }
);

export const deleteExistingProduct = createAsyncThunk(
  "products/deleteExistingProduct",
  async (existingModelCode) => {
    const response = await api.delete("model", existingModelCode);
    return response.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchProducts.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.products = state.products.concat(action.payload);
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewProduct.fulfilled, (state, action) => {
      state.products.push(action.payload);
    });
    builder.addCase(updateExistingProduct.fulfilled, (state, action) => {
      const {
        modelCode,
        name,
        description,
        fashionLine,
        price,
        onlineOnly,
        available,
        productFields,
      } = action.payload;
      const existingProd = state.products.find(
        (prod) => prod.modelCode === modelCode
      );
      if (existingProd) {
        existingProd.name = name;
        existingProd.description = description;
        existingProd.fashionLine = fashionLine;
        existingProd.price = price;
        existingProd.onlineOnly = onlineOnly;
        existingProd.available = available;
        existingProd.productFields = productFields;
      }
    });
    builder.addCase(deleteExistingProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        ({ prodCode }) => prodCode !== action.payload.prodCode
      );
    });
  },
});

export default productSlice.reducer;

export const selectAllProducts = (state) => state.products.products;

export const selectProductByCode = (state, modelCode) =>
  state.products.products.find((product) => product.modelCode === modelCode);
