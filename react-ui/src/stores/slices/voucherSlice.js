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
    const response = await api.create("sam/voucher", initialVoucher);
    return response.data;
  }
);

export const issueVoucher = createAsyncThunk(
  "vouchers/issueVoucher",
  async (voucherCode) => {
    const response = await voucherApi.issue(voucherCode);
    return response.data;
  }
);
export const redeemVoucher = createAsyncThunk(
  "vouchers/redeemVoucher",
  async (voucherCode) => {
    const response = await voucherApi.redeem(voucherCode);
    return response.data;
  }
);

export const deleteExistingVoucher = createAsyncThunk(
  "vouchers/deleteExistingVoucher",
  async (existingVoucherCode) => {
    const response = await api.delete("sam/voucher", existingVoucherCode);
    return response.data;
  }
);

const voucherSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {
    // voucherUpdated(state, action) {
    //   const { id, code, value, isIssued, expDate, isRedeemed } = action.payload;
    //   const existingVoucher = state.vouchers.find(
    //     (voucher) => voucher.id === id
    //   );
    //   if (existingVoucher) {
    //     existingVoucher.code = code;
    //     existingVoucher.value = value;
    //     existingVoucher.isIssued = isIssued;
    //     existingVoucher.expDate = expDate;
    //     existingVoucher.isRedeemed = isRedeemed;
    //   }
    // },
    voucherDeleted(state, action) {
      state.vouchers = state.vouchers.filter(
        ({ voucherCode }) => voucherCode !== action.payload.voucherCode
      );
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchVouchers.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchVouchers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.vouchers = state.vouchers.concat(action.payload);
    });
    builder.addCase(fetchVouchers.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewVouchers.fulfilled, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(issueVoucher.fulfilled, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(redeemVoucher.fulfilled, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(deleteExistingVoucher.fulfilled, (state, action) => {
      state.vouchers = state.vouchers.filter(
        ({ voucherCode }) => voucherCode !== action.payload.voucherCode
      );
      // state.status = "idle"
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
