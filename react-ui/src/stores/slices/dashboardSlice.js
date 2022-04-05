import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dashboardApi } from "../../environments/Api";

const initialState = {
  stockLevelSites: [],
  stockLevelProducts: [],
  customerOrdersByDate: [],
  storeOrdersByDate: [],
  onlineOrdersByDate: [],
  customerOrders: [],
  procurementOrders: [],
  stockTransferOrders: [],
  siteId: -1,
  status: "idle",
  error: null,
};

const dashboardSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setSiteId(state, action) {
      state.siteId = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getStockLevelSites.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getStockLevelSites.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.stockLevelSites = action.payload;
    });
    builder.addCase(getStockLevelSites.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(getCustomerOrders.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getCustomerOrders.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.customerOrdersByDate = action.payload;
    });
    builder.addCase(getCustomerOrders.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(getStoreOrders.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getStoreOrders.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.storeOrdersByDate = action.payload;
    });
    builder.addCase(getStoreOrders.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(getOnlineOrders.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getOnlineOrders.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.onlineOrdersByDate = action.payload;
    });
    builder.addCase(getOnlineOrders.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(getCustomerOrdersOfSite.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getCustomerOrdersOfSite.fulfilled, (state, action) => {
      state.status = "succeeded";
      const { payload } = action;
      if (payload.length > 0) {
        const toUpdate = state.customerOrders.find(
          (x) => x.id === state.siteId
        );
        if (toUpdate) toUpdate.orders = payload;
        else state.customerOrders.push({ id: state.siteId, orders: payload });
      }
    });
    builder.addCase(getCustomerOrdersOfSite.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(getProcurementOrdersOfSite.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getProcurementOrdersOfSite.fulfilled, (state, action) => {
      state.status = "succeeded";
      const { payload } = action;
      if (payload.length > 0) {
        const toUpdate = state.procurementOrders.find(
          (x) => x.id === state.siteId
        );
        if (toUpdate) toUpdate.orders = payload;
        else
          state.procurementOrders.push({ id: state.siteId, orders: payload });
      }
    });
    builder.addCase(getProcurementOrdersOfSite.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(getStockTransferOrdersOfSite.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getStockTransferOrdersOfSite.fulfilled, (state, action) => {
      state.status = "succeeded";
      const { payload } = action;
      if (payload.length > 0) {
        const toUpdate = state.stockTransferOrders.find(
          (x) => x.id === state.siteId
        );
        if (toUpdate) toUpdate.orders = payload;
        else
          state.stockTransferOrders.push({ id: state.siteId, orders: payload });
      }
    });
    builder.addCase(getStockTransferOrdersOfSite.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.messagStore;
    });
  },
});

export const { setSiteId } = dashboardSlice.actions;

export default dashboardSlice.reducer;

export const getStockLevelSites = createAsyncThunk(
  "dashboard/getStockLevelSites",
  async () => {
    const response = await dashboardApi.getStockLevelSites();
    return response.data;
  }
);

export const getCustomerOrders = createAsyncThunk(
  "dashboard/getCustomerOrders",
  async ({ startDate, endDate }) => {
    const response = await dashboardApi.getCustomerOrders({
      startDate,
      endDate,
    });
    return response.data;
  }
);

export const getStoreOrders = createAsyncThunk(
  "dashboard/getStoreOrders",
  async ({ startDate, endDate }) => {
    const response = await dashboardApi.getStoreOrders({ startDate, endDate });
    return response.data;
  }
);

export const getOnlineOrders = createAsyncThunk(
  "dashboard/getOnlineOrders",
  async ({ startDate, endDate }) => {
    const response = await dashboardApi.getOnlineOrders({ startDate, endDate });
    return response.data;
  }
);

export const getCustomerOrdersOfSite = createAsyncThunk(
  "dashboard/getCustomerOrdersOfSite",
  async ({ siteId, date = "" }) => {
    const response = await dashboardApi.getCustomerOrdersOfSite(
      siteId,
      (date = "")
    );
    return response.data;
  }
);

export const getProcurementOrdersOfSite = createAsyncThunk(
  "dashboard/getProcurementOrdersOfSite",
  async ({ siteId, date = "" }) => {
    const response = await dashboardApi.getProcurementOrdersOfSite(
      siteId,
      date
    );
    return response.data;
  }
);

export const getStockTransferOrdersOfSite = createAsyncThunk(
  "dashboard/getStockTransferOrdersOfSite",
  async ({ siteId, date = "" }) => {
    const response = await dashboardApi.getStockTransferOrdersOfSite(
      siteId,
      date
    );
    return response.data;
  }
);
