import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [
  {
    id: 1,
    prodCode: "ADQ0010406H",
    name: "Cut-in Dress",
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
    productAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(prodCode, name, description, listPrice, discPrice, fields) {
        return {
          payload: {
            id: nanoid(),
            prodCode,
            name,
            description,
            listPrice: parseFloat(listPrice),
            discPrice: parseFloat(discPrice),
            fields,
          },
        };
      },
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

export const selectAllProducts = (state) => state.products;

export const selectProductByCode = (state, prodCode) =>
  state.products.find((product) => product.id === prodCode);
