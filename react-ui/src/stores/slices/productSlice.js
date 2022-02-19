import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  products: [],
  status: "idle",
  error: null,
};

//fetch models
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await api.getAll(`sam/model?modelCode=`);
    return response.data;
  }
);

//fetch products
export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async () => {
    const response = await api.getAll(`sam/products?sku=`);
    return response.data;
  }
);


export const addNewProduct = createAsyncThunk(
  "products/addNewPost",
  async (initialProduct) => {
    const response = await api.create("sam/model", initialProduct);
    return response.data;
  }
);

export const updateExistingProduct = createAsyncThunk(
  "products/updateExistingProduct",
  async (existingProduct) => {
    const response = await api.update("sam/model", existingProduct);
    return response.data;
  }
);

export const deleteExistingProduct = createAsyncThunk(
  "products/deleteExistingProduct",
  async (existingModelCode) => {
    const response = await api.delete("sam/model", existingModelCode);
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
      state.products.push(action.payload)
    });
    builder.addCase(updateExistingProduct.fulfilled, (state, action) => {
      const {
        modelCode,
        name,
        description,
        price,
        onlineOnly,
        available,
        products,
        productFields,
      } = action.payload;
      console.log(action.payload)
      const existingProd = state.products.find(
        (prod) => prod.modelCode === modelCode
      );
      if (existingProd) {
        existingProd.name = name;
        existingProd.description = description;
        existingProd.price = price;
        existingProd.onlineOnly = onlineOnly;
        existingProd.available = available;
        existingProd.products = products;
        existingProd.productFields = productFields;
      }
      // state.status = "idle";
    });
    builder.addCase(deleteExistingProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        ({ prodCode }) => prodCode !== action.payload.prodCode
      );
      // state.status = "idle"
    });
  },
});

export default productSlice.reducer;

export const selectAllProducts = (state) => state.products.products;

export const selectProductByCode = (state, modelCode) =>
  state.products.products.find((product) => product.modelCode === modelCode);
