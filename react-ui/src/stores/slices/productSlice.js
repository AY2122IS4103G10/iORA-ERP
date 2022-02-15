import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { productsApi } from "../../environments/Api";

const initialState = {
  products: [
    {
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
  ],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await productsApi.getAll();
    return response.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productAdded: {
      reducer(state, action) {
        state.products.push(action.payload);
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
      const { prodCode, name, description, listPrice, discPrice, fields } =
        action.payload;
      const existingProd = state.products.find((prod) => prod.prodCode === prodCode);
      if (existingProd) {
        existingProd.name = name;
        existingProd.description = description;
        existingProd.listPrice = listPrice;
        existingProd.discPrice = discPrice;
        existingProd.fields = fields;
      }
    },
    productDeleted(state, action) {
      state.products.filter((product) => product !== action.payload);
    },
  },
});

export const { productAdded, productUpdated, productDeleted } =
  productSlice.actions;

export default productSlice.reducer;

export const selectAllProducts = (state) => state.products.products;

export const selectProductByCode = (state, prodCode) =>
  state.products.products.find((product) => product.prodCode === prodCode);
