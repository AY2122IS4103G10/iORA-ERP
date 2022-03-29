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
    try {
      const response = await api.create("admin/addCompany", initialCompany);
      if (response.data === "") return Promise.reject(response.error);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);

export const updateExistingCompany = createAsyncThunk(
  "companies/updateExistingCompany",
  async (existingCompany) => {
    try {
      const response = await api.update("admin/editCompany", existingCompany);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);

export const deleteExistingCompany = createAsyncThunk(
  "companies/deleteExistingCompany",
  async (existingCompanyId) => {
    try {
      const response = await companyApi.deleteCompany(existingCompanyId);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
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
      state.status = "idle";
    });
    builder.addCase(deleteExistingCompany.fulfilled, (state, action) => {
      state.status = "idle";
    });
  },
});

export default companySlice.reducer;

export const selectAllCompanies = (state) => state.companies.companies;

export const selectCompanyById = (state, companyId) =>
  state.companies.companies.find((company) => company.id === companyId);
