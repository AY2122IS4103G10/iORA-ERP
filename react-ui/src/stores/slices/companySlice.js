import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  companies: [],
  status: "idle",
  error: null,
};

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  //storeTypes =["Store", "Headquarters"]
  async ({ storeTypes, country, company }) => {
    const response = await api.getAll(
      `admin/viewSites?storeTypes=${storeTypes.join(
        ","
      )}&country=${country}&company=${company}`
    );
    return response.data;
  }
);

export const addNewCompany = createAsyncThunk(
  "companies/addNewCompany",
  async (storeType, initialSite) => {
    const response = await api.create(
      `admin/addSite/${storeType}`,
      initialSite
    );
    return response.data;
  }
);

export const updateExistingCompany = createAsyncThunk(
  "companies/updateExistingCompany",
  async (existingSite) => {
    const response = await api.update("admin/editSite", existingSite);
    return response.data;
  }
);

export const deleteExistingCompany = createAsyncThunk(
  "companies/deleteExistingCompany",
  async (existingSiteId) => {
    const response = await api.delete("admin/deleteSite", existingSiteId);
    return response.data;
  }
);

const companySlice = createSlice({
  name: "companies",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchCompanies.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchCompanies.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.companies = state.companies.concat(action.payload);
    });
    builder.addCase(fetchCompanies.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewCompany.fulfilled, (state, action) => {
      state.companies.push(action.payload);
    });
    builder.addCase(updateExistingCompany.fulfilled, (state, action) => {
      const {
        companyId,
        name,
        description,
        price,
        onlineOnly,
        available,
        companies,
        productFields,
      } = action.payload;
      console.log(action.payload);
      const existingProd = state.companies.find((prod) => prod.companyId === companyId);
      if (existingProd) {
        existingProd.name = name;
        existingProd.description = description;
        existingProd.price = price;
        existingProd.onlineOnly = onlineOnly;
        existingProd.available = available;
        existingProd.companies = companies;
        existingProd.productFields = productFields;
      }
      // state.status = "idle";
    });
    builder.addCase(deleteExistingCompany.fulfilled, (state, action) => {
      state.companies = state.companies.filter(
        ({ companyId }) => companyId !== action.payload.companyId
      );
      // state.status = "idle"
    });
  },
});

export default companySlice.reducer;

export const selectAllCompanies = (state) => state.companies.companies;

export const selectCompanyById = (state, companyId) =>
  state.companies.companies.find((company) => company.companyId === companyId);
