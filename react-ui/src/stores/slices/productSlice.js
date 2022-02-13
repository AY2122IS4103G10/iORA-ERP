import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    prodCode: "ADQ0010406H",
    prodName: "Cut-in Dress",
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
    ],
  },
];

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    productAdded : {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(prodCode, prodName, description, listPrice, discPrice, fields) {
        return {
          payload: {
            prodCode: prodCode.length ? prodCode : "A0123456789B",
            prodName,
            description,
            listPrice,
            discPrice,
            fields
          }
        }
      }
    },
    productUpdated(state, action) {
      const { code, name, description, listPrice, discPrice, fields } =
        action.payload;
      const existingProd = state.products.find((prod) => prod.code === code);
      if (existingProd) {
        existingProd.name = name;
        existingProd.description = description;
        existingProd.listPrice = listPrice;
        existingProd.discPrice = discPrice;
        existingProd.fields = fields;
      }
    },
  },
});

export const { productAdded, productUpdated } = productSlice.actions;

export default productSlice.reducer;
