import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [
  {
    id: 1,
    code: "RKF3X8NDND",
    issuedDate: new Date(),
    expDate: new Date(),
    isRedeemed: false,
  },
];

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    voucherAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(code, value, issuedDate, expDate, isRedeemed) {
        return {
          payload: {
            id: nanoid(),
            code,
            value,
            issuedDate,
            expDate,
            isRedeemed,
          },
        };
      },
    },
    voucherUpdated(state, action) {
      const { id, code, value, issuedDate, expDate, isRedeemed } = action.payload;
      const existingProd = state.vouchers.find((voucher) => voucher.id === id);
      if (existingProd) {
        existingProd.code = code;
        existingProd.value = value;
        existingProd.issuedDate = issuedDate;
        existingProd.expDate = expDate;
        existingProd.isRedeemed = isRedeemed;
      }
    },
  },
});

export const { voucherAdded, voucherUpdated } = voucherSlice.actions;

export default voucherSlice.reducer;
