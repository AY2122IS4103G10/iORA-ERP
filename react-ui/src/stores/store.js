import { configureStore } from "@reduxjs/toolkit";
import productReducer from './slices/productSlice'
import prodFieldReducer from "./slices/prodFieldSlice";

export default configureStore({
  reducer: {
    products: productReducer,
    prodFields: prodFieldReducer,
  }
})