import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  sites: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk("pos/main", async () => {
  const response = await api.getAll(`/store/customerOrder/`);
  return response.data;
});
