import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  companies: [
    {
      id: 1,
      name: "iORA Fashion Pte. Ltd.",
      registerNumber: "199703089W",
      phoneNumber: "+65-63610056",
      active: true,
      address: {
        id: 2,
        country: "SINGAPORE",
        city: "Singapore",
        building: "Enterprise 10",
        state: "Singapore",
        unit: "NIL",
        road: "10P Enterprise Road",
        postalCode: "Singapore 629840",
        billing: false,
        latitude: 1.334251,
        longitude: 103.704246,
        coordinates: "(1.334251, 103.704246)",
      },
      departments: [
        {
          id: 1,
          deptName: "Sales and Marketing",
          jobTitles: [],
          responsibility: [],
          department: "Sales and Marketing",
        },
      ],
    },
  ],
  status: "idle",
  error: null,
};

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  //storeTypes =["Store", "Headquarters"]
  async ({ storeTypes, country, company }) => {
    const response = await api.getAll(
      `admin/viewCompanies?search=${storeTypes.join(
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
      const existingProd = state.companies.find(
        (prod) => prod.companyId === companyId
      );
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
