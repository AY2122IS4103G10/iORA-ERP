import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  procurements: [{ id: 1 }],
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
  "procurements/addNewPost",
  async (siteId, initialProcurement) => {
    const response = await api.create(
      `sam/procurementOrder/create/${siteId}`,
      initialProcurement
    );
    return response.data;
  }
);

export const updateExistingProcurement = createAsyncThunk(
  "procurements/updateExistingProcurement",
  async (siteId, existingProcurement) => {
    const response = await api.update(
      `sam/procurementOrder/update/${siteId}`,
      existingProcurement
    );
    return response.data;
  }
);

export const deleteExistingProcurement = createAsyncThunk(
  "procurements/deleteExistingProcurement",
  async (siteId, orderId, existingModelCode) => {
    const response = await api.delete("sam/model", existingModelCode);
    return response.data;
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
      state.procurements = state.procurements.concat(action.payload);
    });
    builder.addCase(fetchProcurements.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewProcurement.fulfilled, (state, action) => {
      state.procurements.push(action.payload);
    });
    builder.addCase(updateExistingProcurement.fulfilled, (state, action) => {
      const {
        orderId,
        name,
        description,
        price,
        onlineOnly,
        available,
        procurements,
        productFields,
      } = action.payload;
      console.log(action.payload);
      const existingProd = state.procurements.find(
        (prod) => prod.orderId === orderId
      );
      if (existingProd) {
        existingProd.name = name;
        existingProd.description = description;
        existingProd.price = price;
        existingProd.onlineOnly = onlineOnly;
        existingProd.available = available;
        existingProd.procurements = procurements;
        existingProd.productFields = productFields;
      }
      // state.status = "idle";
    });
    builder.addCase(deleteExistingProcurement.fulfilled, (state, action) => {
      state.procurements = state.procurements.filter(
        ({ prodCode }) => prodCode !== action.payload.prodCode
      );
      // state.status = "idle"
    });
  },
});

export default procurementSlice.reducer;

export const selectAllProcurements = (state) => state.procurements.procurements;

export const selectProcurementById = (state, orderId) =>
  state.procurements.procurements.find(
    (procurement) => procurement.orderId === orderId
  );
