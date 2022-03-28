import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  products: [], //models
  model: null,
  currProduct: null,
  prodItem: null,
  prodDetails: null, // Selective details for order summary
  status: "idle",
  error: null,
};

//fetch models
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await api.getAll("sam/model?modelCode=");
    return response.data;
  }
);

export const fetchModel = createAsyncThunk(
  "products/fetchModel",
  async (modelCode) => {
    const response = await api.get("sam/model", modelCode);
    return response.data;
  }
);

//get a product
export const getAProduct = createAsyncThunk(
  "products/getAProduct",
  async (sku) => {
    const response = await api.get(`sam/product`, sku);
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

export const getProductItem = createAsyncThunk(
  "products/getProductItem",
  async (rfid) => {
    const response = await api.get("sam/productItem", rfid);
    return response.data;
  }
);

export const getProductDetails = createAsyncThunk(
  "products/getProductDetails",
  async (rfid) => {
    const response = await api.get("store/productDetails", rfid);
    return response.data;
  }
);

export const updateBaselineQty = createAsyncThunk(
  "products/updateBaselineQty",
  async ({ sku, qty }) => {
    const response = await api.update(`sam/product/baseline/${sku}/${qty}`);
    return response.data;
  }
);

export const deleteSku = createAsyncThunk(
  "products/deleteSku",
  async (data) => {
    const response = await api.delete("sam/product/delete", data);
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
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(fetchModel.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchModel.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.model = action.payload;
    });
    builder.addCase(fetchModel.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(getAProduct.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getAProduct.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.currProduct = action.payload;
    });
    builder.addCase(getAProduct.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewProduct.fulfilled, (state, action) => {
      state.products.push(action.payload);
    });
    builder.addCase(updateExistingProduct.fulfilled, (state, action) => {
      state.status = "idle";
    });
    
    builder.addCase(getProductItem.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getProductItem.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.prodItem = action.payload;
    });
    builder.addCase(getProductItem.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(getProductDetails.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getProductDetails.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.prodDetails = action.payload;
    });
    builder.addCase(getProductDetails.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(updateBaselineQty.fulfilled, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(deleteSku.fulfilled, (state, action) => {
      state.status = "idle";
    });
  },
});

export default productSlice.reducer;

export const selectAllProducts = (state) => state.products.products;

export const selectAProduct = (state) => state.products.currProduct;

export const selectModel = (state) => state.products.model;

export const selectProductByCode = (state, modelCode) =>
  state.products.products.find((product) => product.modelCode === modelCode);

export const selectProductItem = (state) => state.products.prodItem;

export const selectProductDetails = (state) => state.products.prodDetails;
