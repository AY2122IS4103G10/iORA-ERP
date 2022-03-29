import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { posApi } from "../../environments/Api";

const initialState = {
  posOrders: [],
  searchedOrder: {},
  status: "idle",
  error: null,
};

export const fetchSiteOrders = createAsyncThunk(
  "store/customerOrder",
  async (siteId) => {
    const response = await posApi.getOrders(siteId);
    return response.data;
  }
);

export const addProductToLineItems = createAsyncThunk(
  "store/addProductToLineItems",
  async (rfidsku, lineItems) => {
    const response = await posApi.addProductToLineItems(rfidsku, lineItems);
    return response.data;
  }
);

export const getVoucherByCode = createAsyncThunk(
  "vouchers/getVoucherByCode",
  async (voucher) => {
    const response = await posApi.getVoucherByCode(voucher);
    return response.data;
  }
);

export const fetchAnOrder = createAsyncThunk(
  "store/getCustomerOrder",
  async (orderId) => {
    const response = await posApi.getOrder(orderId);
    return response.data;
  }
);

export const addRefundLineItem = createAsyncThunk(
  "store/addRefundLI",
  async (orderId, refundLI) => {
    const response = await posApi.addRefundLineItem(orderId, refundLI);
    return response.data;
  }
);

export const addExchangeLineItem = createAsyncThunk(
  "store/addExchangeLI",
  async (orderId, refundLI) => {
    const response = await posApi.addExchangeLineItem(orderId, refundLI);
    return response.data;
  }
);

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
    builder.addCase(fetchAnOrder.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.searchedOrder = action.payload;
    });
    builder.addCase(addRefundLineItem.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.searchedOrder = action.payload;
    });
    builder.addCase(addExchangeLineItem.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.searchedOrder = action.payload;
    });
  },
});

export default posSlice.reducer;

export const selectAllOrder = (state) => state.pos.posOrders;
export const selectOrderById = (state, id) =>
  state.pos.searchedOrder.id === id
    ? state.pos.searchedOrder
    : state.pos.posOrders.find((order) => order.id === id);
