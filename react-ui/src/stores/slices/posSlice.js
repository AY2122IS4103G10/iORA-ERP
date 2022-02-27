import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../../environments/Api";

const initialState = {
  order: [],
  status: "idle",
  error: null,
};

export const fetchSiteOrders = createAsyncThunk("pos/main", async () => {
  const response = await api.getAll(`/store/customerOrder/`);
  return response.data;
});
