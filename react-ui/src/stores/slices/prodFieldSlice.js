import { createSlice } from "@reduxjs/toolkit";

const initialState = [
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
  {
    fieldId: 7,
    fieldName: "Category",
    fieldValue: "Dress",
  },
  {
    fieldId: 8,
    fieldName: "Category",
    fieldValue: "Shorts",
  },
];

const prodFieldSlice = createSlice({
  name: "prodField",
  initialState,
  reducers: {
    prodFieldAdded(state, action) {
      state.posts.push(action.payload);
    },
  },
});

export const { prodFieldAdded } = prodFieldSlice.actions;

export default prodFieldSlice.reducer;