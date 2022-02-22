import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  products: [],
  currProduct: null, //selected product for stock level
  prodStockLevel: null, //view product's stock level
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

//get a product
export const getAProduct = createAsyncThunk(
  "products/getAProduct",
  async (sku) => {
    const response = await api.get(`sam/product`, sku);
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
)

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
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
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

export const selectAProduct = (state) => state.products.currProduct;

export const selectProductSL = (state) => state.products.prodStockLevel;

export const selectProductByCode = (state, modelCode) =>
  state.products.products.find((product) => product.modelCode === modelCode);
