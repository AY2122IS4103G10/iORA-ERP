import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import productReducer from './slices/productSlice';
import prodFieldReducer from "./slices/prodFieldSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    prodFields: prodFieldReducer,
  }
})