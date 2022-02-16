import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  vouchers: [
    {
      id: 1,
      code: "RKF3X8NDND",
      value: 10,
      isIssued: false,
      expDate: new Date().toJSON(),
      isRedeemed: false,
    },
  ],
  status: "idle",
  error: null,
};

export const fetchVouchers = createAsyncThunk(
  "vouchers/fetchVouchers",
  async () => {
    const response = await api.getAll("voucher");
    return response.data;
  }
);

export const addNewVouchers = createAsyncThunk(
  "products/addNewPost",
  async (initialVoucher) => {
    const response = await api.create("voucher", initialVoucher);
    return response.data;
  }
);

const voucherSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {
    voucherAdded: {
      reducer(state, action) {
        state.vouchers.push(action.payload);
      },
      prepare(code, value, expDate) {
        return {
          payload: {
            id: nanoid(),
            code,
            value,
            isIssued: false,
            expDate: expDate.toJSON(),
            isRedeemed: false,
          },
        };
      },
    },
    voucherUpdated(state, action) {
      const { id, code, value, isIssued, expDate, isRedeemed } =
        action.payload;
      const existingVoucher = state.vouchers.find(
        (voucher) => voucher.id === id
      );
      if (existingVoucher) {
        existingVoucher.code = code;
        existingVoucher.value = value;
        existingVoucher.isIssued = isIssued;
        existingVoucher.expDate = expDate;
        existingVoucher.isRedeemed = isRedeemed;
      }
    },
    voucherDeleted(state, action) {
      state.vouchers = state.vouchers.filter(
        ({ id }) => id !== action.payload.id
      );
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchVouchers.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchVouchers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.products = state.products.concat(action.payload);
    });
    builder.addCase(fetchVouchers.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewVouchers.fulfilled, (state, action) => {
      state.vouchers.push(action.payload);
    });
  },
});

export const { voucherAdded, voucherUpdated, voucherDeleted } =
  voucherSlice.actions;

export default voucherSlice.reducer;

export const selectAllVouchers = (state) => state.vouchers.vouchers;

export const selectVoucherById = (state, voucherId) =>
  state.vouchers.vouchers.find((voucher) => voucher.id === voucherId);
