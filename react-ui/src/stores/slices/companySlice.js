import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, companyApi } from "../../environments/Api";

const initialState = {
  companies: [],
  status: "idle",
  error: null,
};

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async () => {
    const response = await api.getAll("admin/viewCompanies?search=");
    return response.data;
  }
);

export const addNewCompany = createAsyncThunk(
  "companies/addNewCompany",
  async (initialCompany) => {
    const response = await api.create("admin/addCompany", initialCompany);
    return response.data;
  }
);

export const updateExistingCompany = createAsyncThunk(
  "companies/updateExistingCompany",
  async (existingCompany) => {
    const response = await api.update("admin/editCompany", existingCompany);
    return response.data;
  }
);

export const deleteExistingCompany = createAsyncThunk(
  "companies/deleteExistingCompany",
  async (existingCompanyId) => {
    const response = await companyApi.deleteCompany(existingCompanyId);
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
      state.companies = action.payload;
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
        address,
        registerNumber,
        telephone,
        active,
        departments,
        vendors,
      } = action.payload;
      const existingProd = state.companies.find(
        (prod) => prod.companyId === companyId
      );
      if (existingProd) {
        existingProd.name = name;
        existingProd.address = address;
        existingProd.registerNumber = registerNumber;
        existingProd.telephone = telephone;
        existingProd.active = active;
        existingProd.departments = departments;
        existingProd.vendors = vendors;
      }
      // state.status = "idle";
    });
    builder.addCase(deleteExistingCompany.fulfilled, (state, action) => {
      // state.companies = state.companies.filter(
      //   ({ companyId }) => companyId !== action.payload.companyId
      // );
      state.status = "idle"
    });
  },
});

export default companySlice.reducer;

export const selectAllCompanies = (state) => state.companies.companies;

export const selectCompanyById = (state, companyId) =>
  state.companies.companies.find((company) => company.id === companyId);
