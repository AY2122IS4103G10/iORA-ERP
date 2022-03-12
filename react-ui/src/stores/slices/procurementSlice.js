import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, procurementApi } from "../../environments/Api";

const initialState = {
  procurements: [],
  status: "idle",
  error: null,
};

export const fetchProcurements = createAsyncThunk(
  "procurements/fetchProcurements",
  async () => {
    const response = await api.getAll(`sam/procurementOrder/all`);
    return response.data;
  }
);

export const addNewProcurement = createAsyncThunk(
  "procurements/addNewProcurement",
  async (initialProcurement) => {
    const response = await api.create(
      `sam/procurementOrder/create/${initialProcurement.siteId}`,
      initialProcurement.initialProcurement
    );
    return response.data;
  }
);

export const updateExistingProcurement = createAsyncThunk(
  "procurements/updateExistingProcurement",
  async (existingProcurement) => {
    const response = await api.update(
      `sam/procurementOrder/update/${existingProcurement.siteId}`,
      existingProcurement.existingProcurement
    );
    return response.data;
  }
);

export const deleteExistingProcurement = createAsyncThunk(
  "procurements/deleteExistingProcurement",
  async ({ orderId, siteId }) => {
    const response = await api.delete(
      `sam/procurementOrder/delete/${orderId}`,
      siteId
    );
    return response.data;
  }
);

export const acceptProcurement = createAsyncThunk(
  "procurements/acceptProcurement",
  async ({ orderId, siteId }) => {
    const response = await procurementApi.acceptOrder(orderId, siteId);
    return response.data;
  }
);

export const cancelProcurement = createAsyncThunk(
  "procurements/cancelProcurement",
  async ({ orderId, siteId }) => {
    const response = await procurementApi.cancelOrder(orderId, siteId);
    return response.data;
  }
);

export const scanItem = createAsyncThunk(
  "procurements/scanItem",
  async ({ orderId, barcode }) => {
    try {
      const response = await procurementApi.scanItem(orderId, barcode);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.message);
    }
  }
);

const procurementSlice = createSlice({
  name: "procurements",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchProcurements.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchProcurements.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.procurements = action.payload;
    });
    builder.addCase(fetchProcurements.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewProcurement.fulfilled, (state, action) => {
      state.procurements.push(action.payload);
    });
    builder.addCase(updateExistingProcurement.fulfilled, (state, action) => {
      const {
        id,
        name,
        description,
        price,
        onlineOnly,
        available,
        procurements,
        productFields,
      } = action.payload;
      const existingProcurement = state.procurements.find(
        (procurement) => procurement.id === id
      );
      if (existingProcurement) {
        existingProcurement.name = name;
        existingProcurement.description = description;
        existingProcurement.price = price;
        existingProcurement.onlineOnly = onlineOnly;
        existingProcurement.available = available;
        existingProcurement.procurements = procurements;
        existingProcurement.productFields = productFields;
      }
    });
    builder.addCase(deleteExistingProcurement.fulfilled, (state, action) => {
      state.procurements = state.procurements.filter(
        ({ prodCode }) => prodCode !== action.payload.prodCode
      );
    });
    builder.addCase(acceptProcurement.fulfilled, (state, action) => {
      const { id, statusHistory } = action.payload;
      const existingProcurement = state.procurements.find(
        (procurement) => procurement.id === id
      );
      if (existingProcurement) {
        existingProcurement.statusHistory = statusHistory;
      }
    });
    builder.addCase(cancelProcurement.fulfilled, (state, action) => {
      const { id, statusHistory } = action.payload;
      const existingProcurement = state.procurements.find(
        (procurement) => procurement.id === id
      );
      if (existingProcurement) {
        existingProcurement.statusHistory = statusHistory;
      }
    });
  },
});

export default procurementSlice.reducer;

export const selectAllProcurements = (state) => state.procurements.procurements;

export const selectProcurementById = (state, orderId) =>
  state.procurements.procurements.find(
    (procurement) => procurement.id === orderId
  );
