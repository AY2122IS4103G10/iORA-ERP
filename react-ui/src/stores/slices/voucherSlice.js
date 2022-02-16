import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  vouchers: [
    {
      id: 1,
      code: "RKF3X8NDND",
      value: 10,
      issuedDate: new Date().toJSON(),
      expDate: new Date().toJSON(),
      isRedeemed: false,
    },
  ],
  status: "idle",
  error: null,
};

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
            issuedDate: new Date().toJSON(),
            expDate: expDate.toJSON(),
            isRedeemed: false,
          },
        };
      },
    },
    voucherUpdated(state, action) {
      const { id, code, value, issuedDate, expDate, isRedeemed } =
        action.payload;
      const existingVoucher = state.vouchers.find(
        (voucher) => voucher.id === id
      );
      if (existingVoucher) {
        existingVoucher.code = code;
        existingVoucher.value = value;
        existingVoucher.issuedDate = issuedDate;
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
});

export const { voucherAdded, voucherUpdated, voucherDeleted } =
  voucherSlice.actions;

export default voucherSlice.reducer;

export const selectAllVouchers = (state) => state.vouchers.vouchers;

export const selectVoucherById = (state, voucherId) =>
  state.vouchers.vouchers.find((voucher) => voucher.id === voucherId);
