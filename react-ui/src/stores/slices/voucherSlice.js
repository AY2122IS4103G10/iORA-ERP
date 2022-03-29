import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, voucherApi } from "../../environments/Api";

const initialState = {
  vouchers: [],
  status: "idle",
  error: null,
};

export const fetchVouchers = createAsyncThunk(
  "vouchers/fetchVouchers",
  async () => {
    const response = await api.getAll("sam/voucher");
    return response.data;
  }
);

export const addNewVouchers = createAsyncThunk(
  "vouchers/addNewVouchers",
  async (initialVoucher) => {
    try {
      const response = await api.create("sam/voucher", initialVoucher);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);

export const issueVoucher = createAsyncThunk(
  "vouchers/issueVoucher",
  async ({ code: voucherCode, id: customerId }) => {
    try {
      const response = await voucherApi.issue(voucherCode, customerId);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);
export const redeemVoucher = createAsyncThunk(
  "vouchers/redeemVoucher",
  async (voucherCode) => {
    try {
      const response = await voucherApi.redeem(voucherCode);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);

export const deleteExistingVoucher = createAsyncThunk(
  "vouchers/deleteExistingVoucher",
  async (existingVoucherCode) => {
    try {
      const response = await api.delete(
        "sam/voucher/delete",
        existingVoucherCode
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);

const voucherSlice = createSlice({
  name: "vouchers",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchVouchers.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchVouchers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.vouchers = action.payload;
    });
    builder.addCase(fetchVouchers.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewVouchers.fulfilled, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(issueVoucher.fulfilled, (state, action) => {
      const { voucherCode, issued } = action.payload;
      const existingVoucher = state.vouchers.find(
        (voucher) => voucher.voucherCode === voucherCode
      );
      if (existingVoucher) {
        existingVoucher.issued = issued;
      }
    });
    builder.addCase(redeemVoucher.fulfilled, (state, action) => {
      const { voucherCode, redeemed } = action.payload;
      const existingVoucher = state.vouchers.find(
        (voucher) => voucher.voucherCode === voucherCode
      );
      if (existingVoucher) {
        existingVoucher.redeemed = redeemed;
      }
      state.status = "idle";
    });
    builder.addCase(deleteExistingVoucher.fulfilled, (state, action) => {
      state.status = "idle";
    });
  },
});

export const { voucherUpdated, voucherDeleted } = voucherSlice.actions;

export default voucherSlice.reducer;

export const selectAllVouchers = (state) => state.vouchers.vouchers;

export const selectVoucherByCode = (state, voucherCode) =>
  state.vouchers.vouchers.find(
    (voucher) => voucher.voucherCode === voucherCode
  );
