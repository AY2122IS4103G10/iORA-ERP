import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    prodCode: 1,
    prodName: "First Post!",
    description: "Hello!",
    listPrice: 10.99,
    discPrice: 8.99,
    fields: [
      {
        fieldId: 1,
        fieldName: "Color",
        fieldValue: "RED",
      },
      {
        fieldId: 2,
        fieldName: "Color",
        fieldValue: "BLUE",
      },
      {
        fieldId: 3,
        fieldName: "Color",
        fieldValue: "YELLOW",
      },
      {
        fieldId: 4,
        fieldName: "Size",
        fieldValue: "S",
      },
      {
        fieldId: 5,
        fieldName: "Size",
        fieldValue: "M",
      },
      {
        fieldId: 6,
        fieldName: "Size",
        fieldValue: "L",
      },
    ],
  },
];

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    productAdded(state, action) {
      state.posts.push(action.payload);
    },
  },
});

export const { productAdded } = productSlice.actions;

export default productSlice.reducer;
