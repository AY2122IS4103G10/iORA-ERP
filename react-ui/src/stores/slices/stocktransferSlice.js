import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, stockTransferApi } from "../../environments/Api";

const initialState = {
  orders: [],
  currOrder: {},
  status: "idle",
  error: null,
};

export const getAllStockTransfer = createAsyncThunk(
  "stocktransfer/getAllOrders",
  async (currSiteId) => {
    console.log(currSiteId);
    if (currSiteId === 1) {
      //if by hq then get all stock transfer
      const response = await api.getAll("store/stockTransfer/all");
      return response.data;
    } else {
      const response = await api.getAll(
        `store/stockTransfer/site/${currSiteId}`
      );
      return response.data;
    }
  }
);

export const getStockTransfer = createAsyncThunk(
  "stocktransfer/getStockTransfer",
  async (id) => {
    const response = await api.get(`store/stockTransfer`, id);
    return response.data;
  }
);

export const createStockTransfer = createAsyncThunk(
  "stocktransfer/create",
  async (data) => {
    const response = await api.create(
      `store/stockTransfer/create/${data.siteId}`,
      data.order
    );
    return response.data;
  }
);

export const cancelStockTransfer = createAsyncThunk(
  "stocktransfer/cancel",
  async (data) => {
    const response = await stockTransferApi.cancelOrder(
      data.orderId,
      data.siteId
    );
    return response.data;
  }
);

export const editStockTransfer = createAsyncThunk(
  "stocktransfer/edit",
  async (data) => {
    const response = await stockTransferApi.editOrder(data.order, data.siteId);
    return response.data;
  }
);

export const rejectStockTransfer = createAsyncThunk(
  "stocktransfer/reject",
  async (data) => {
    const response = await stockTransferApi.rejectOrder(
      data.orderId,
      data.siteId
    );
    return response.data;
  }
);

export const confirmStockTransfer = createAsyncThunk(
  "stocktransfer/confirm",
  async (data) => {
    const response = await stockTransferApi.confirmOrder(
      data.orderId,
      data.siteId
    );
    return response.data;
  }
);

export const pickPackStockTransfer = createAsyncThunk(
  "stocktransfer/pickPack",
  async ({ orderId, siteId }) => {
    const response = await stockTransferApi.pickPack(orderId, siteId);
    return response.data;
  }
);

export const scanItemStockTransfer = createAsyncThunk(
  "stocktransfer/scanItem",
  async ({ orderId, barcode }) => {
    const response = await stockTransferApi.scanItem(orderId, barcode);
    return response.data;
  }
);

export const scanReceiveStockTransfer = createAsyncThunk(
  "stocktransfer/scanReceive",
  async ({ orderId, barcode }) => {
    const response = await stockTransferApi.scanReceive(orderId, barcode);
    return response.data;
  }
);

// export const readyStockTransfer = createAsyncThunk(
//   "stocktransfer/ready",
//   async (data) => {
//     const response = await stockTransferApi.readyOrder(data.order, data.siteId);
//     return response.data;
//   }
// );

export const deliverStockTransfer = createAsyncThunk(
  "stocktransfer/deliver",
  async (data) => {
    const response = await stockTransferApi.deliverOrder(data);
    return response.data;
  }
);

export const deliverMultipleStockTransfer = createAsyncThunk(
  "stocktransfer/deliverMultiple",
  async (data) => {
    const response = await stockTransferApi.deliverMultiple(data);
    return response.data;
  }
);

export const completeStockTransfer = createAsyncThunk(
  "stocktransfer/complete",
  async (data) => {
    const response = await stockTransferApi.completeOrder(
      data.order,
      data.siteId
    );
    return response.data;
  }
);

const stocktransferSlice = createSlice({
  name: "stocktransfer",
  initialState,
  extraReducers(builder) {
    builder.addCase(createStockTransfer.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(createStockTransfer.fulfilled, (state, action) => {
      state.status = "succeeded";
    });
    builder.addCase(createStockTransfer.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(getAllStockTransfer.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getAllStockTransfer.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.orders = action.payload;
    });
    builder.addCase(getAllStockTransfer.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(getStockTransfer.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getStockTransfer.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.currOrder = action.payload;
    });
    builder.addCase(getStockTransfer.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(cancelStockTransfer.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(cancelStockTransfer.fulfilled, (state, action) => {
      state.status = "succeeded";
    });
    builder.addCase(cancelStockTransfer.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(editStockTransfer.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(editStockTransfer.fulfilled, (state, action) => {
      state.status = "succeeded";
    });
    builder.addCase(editStockTransfer.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(rejectStockTransfer.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(rejectStockTransfer.fulfilled, (state, action) => {
      state.status = "succeeded";
    });
    builder.addCase(rejectStockTransfer.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(confirmStockTransfer.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(confirmStockTransfer.fulfilled, (state, action) => {
      state.status = "succeeded";
    });
    builder.addCase(confirmStockTransfer.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(pickPackStockTransfer.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(pickPackStockTransfer.fulfilled, (state, action) => {
      const { statusHistory } = action.payload;
      if (state.currOrder) {
        state.currOrder.statusHistory = statusHistory;
      }
      state.status = "succeeded";
    });
    builder.addCase(pickPackStockTransfer.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(scanItemStockTransfer.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(scanItemStockTransfer.fulfilled, (state, action) => {
      const { statusHistory, lineItems } = action.payload;
      if (state.currOrder) {
        state.currOrder.statusHistory = statusHistory;
        state.currOrder.lineItems = lineItems;
      }
      state.status = "succeeded";
    });
    builder.addCase(scanItemStockTransfer.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(scanReceiveStockTransfer.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(scanReceiveStockTransfer.fulfilled, (state, action) => {
      const { statusHistory, lineItems } = action.payload;
      if (state.currOrder) {
        state.currOrder.statusHistory = statusHistory;
        state.currOrder.lineItems = lineItems;
      }
      state.status = "succeeded";
    });
    builder.addCase(scanReceiveStockTransfer.rejected, (state, action) => {
      state.status = "failed";
    });
    // builder.addCase(readyStockTransfer.pending, (state, action) => {
    //   state.status = "loading";
    // });
    // builder.addCase(readyStockTransfer.fulfilled, (state, action) => {
    //   state.status = "succeeded";
    // });
    // builder.addCase(readyStockTransfer.rejected, (state, action) => {
    //   state.status = "failed";
    // });
    builder.addCase(deliverStockTransfer.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(deliverStockTransfer.fulfilled, (state, action) => {
      const { statusHistory } = action.payload;
      if (state.currOrder) {
        state.currOrder.statusHistory = statusHistory;
      }
      state.status = "succeeded";
    });
    builder.addCase(deliverStockTransfer.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(deliverMultipleStockTransfer.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(deliverMultipleStockTransfer.fulfilled, (state, action) => {
      const { statusHistory } = action.payload;
      if (state.currOrder) {
        state.currOrder.statusHistory = statusHistory;
      }
      state.status = "succeeded";
    });
    builder.addCase(deliverMultipleStockTransfer.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(completeStockTransfer.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(completeStockTransfer.fulfilled, (state, action) => {
      state.status = "succeeded";
    });
    builder.addCase(completeStockTransfer.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

export default stocktransferSlice.reducer;

export const selectAllOrders = (state) => state.stocktransfer.orders;

export const selectStockTransferOrder = (state) =>
  state.stocktransfer.currOrder;
