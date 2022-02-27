import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api, posApi} from "../../environments/Api";

const initialState = {
  pos: [],
  status: "idle",
  error: null,
};

export const fetchSiteOrders = createAsyncThunk("str/pos", async (siteId) => {
  const response = await posApi.getOrders(`store/customerOrder/${siteId}`);
  return response.data;
});

const posSlice = createSlice({
  name: "pos",
  initialState,

  extraReducers(builder) {
    builder.addCase(fetchSiteOrders.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchSiteOrders.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.posOrders = action.payload;
    });
    builder.addCase(fetchSiteOrders.rejected, (state, action) => {
      state.status = "loading";
      state.error = action.error.message;
    });
  },
});

export default posSlice.reducer;

export const selectAllOrder = (state) => state.pos.posOrders;
