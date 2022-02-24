import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { sitesApi } from "../../environments/Api";

import { api } from "../../environments/Api";

const initialState = {
  sites: [],
  headquarters: [],
  manufacturing: [],
  warehouse: [],
  stores: [],
  currSite: [],
  status: "idle",
  hqStatus: "idle",
  manStatus: "idle",
  warStatus: "idle",
  error: null,
};

export const getAllSites = createAsyncThunk(
  "stocklevels/getAllSites",
  async () => {
    const response = await sitesApi.getAll();
    return response.data;
  }
);

export const getASite = createAsyncThunk("stocklevels/getASite", async (id) => {
  const response = await sitesApi.getASite(id);
  return response.data;
});

export const fetchSites = createAsyncThunk("sites/fetchSites", async () => {
  const response = await api.getAll("admin/viewSites/all");
  return response.data;
});

export const fetchHeadquarters = createAsyncThunk(
  "sites/fetchHeadquarters",
  async () => {
    const response = await sitesApi.searchByType("Headquarters");
    return response.data;
  }
);

export const fetchManufacturing = createAsyncThunk(
  "sites/fetchManufacturing",
  async () => {
    const response = await sitesApi.searchByType("Manufacturing");
    return response.data;
  }
);

export const fetchWarehouse = createAsyncThunk(
  "sites/fetchWarehouse",
  async () => {
    const response = await sitesApi.searchByType("Warehouse");
    return response.data;
  }
);

export const addNewSite = createAsyncThunk(
  "sites/addNewSite",
  async (initialSite) => {
    const response = await api.create(
      `admin/addSite/${initialSite.storeType}`,
      initialSite.initialSite
    );
    return response.data;
  }
);

export const updateExistingSite = createAsyncThunk(
  "sites/updateExistingSite",
  async (existingSite) => {
    const response = await api.update("admin/editSite", existingSite);
    return response.data;
  }
);

export const deleteExistingSite = createAsyncThunk(
  "sites/deleteExistingSite",
  async (existingSiteId) => {
    const response = await sitesApi.deleteSite(existingSiteId);
    return response.data;
  }
);

const siteSlice = createSlice({
  name: "sites",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchSites.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchSites.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.sites = action.payload;
    });
    builder.addCase(fetchSites.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(fetchHeadquarters.pending, (state, action) => {
      state.hqStatus = "loading";
    });
    builder.addCase(fetchHeadquarters.fulfilled, (state, action) => {
      state.hqStatus = "succeeded";
      state.headquarters = action.payload;
    });
    builder.addCase(fetchHeadquarters.rejected, (state, action) => {
      state.hqStatus = "failed";
      state.error = action.error.message;
    });
    builder.addCase(fetchManufacturing.pending, (state, action) => {
      state.manStatus = "loading";
    });
    builder.addCase(fetchManufacturing.fulfilled, (state, action) => {
      state.manStatus = "succeeded";
      state.manufacturing = action.payload;
    });
    builder.addCase(fetchManufacturing.rejected, (state, action) => {
      state.manStatus = "failed";
      state.error = action.error.message;
    });
    builder.addCase(fetchWarehouse.pending, (state, action) => {
      state.warStatus = "loading";
    });
    builder.addCase(fetchWarehouse.fulfilled, (state, action) => {
      state.warStatus = "succeeded";
      state.warehouse = action.payload;
    });
    builder.addCase(fetchWarehouse.rejected, (state, action) => {
      state.warStatus = "failed";
      state.error = action.error.message;
    });
    builder.addCase(getAllSites.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getAllSites.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.sites = action.payload;
    });
    builder.addCase(getAllSites.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(getASite.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getASite.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.currSite = action.payload;
    });
    builder.addCase(getASite.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(addNewSite.fulfilled, (state, action) => {
      state.sites.push(action.payload);
    });
    builder.addCase(updateExistingSite.fulfilled, (state, action) => {
      const {
        id,
        name,
        address,
        siteCode,
        phoneNumber,
        active,
        stockLevel,
        company,
        procurementOrders,
      } = action.payload;
      const existingProd = state.sites.find((site) => site.id === id);
      if (existingProd) {
        existingProd.name = name;
        existingProd.address = address;
        existingProd.siteCode = siteCode;
        existingProd.phoneNumber = phoneNumber;
        existingProd.active = active;
        existingProd.stockLevel = stockLevel;
        existingProd.company = company;
        existingProd.procurementOrders = procurementOrders;
      }
    });
    builder.addCase(deleteExistingSite.fulfilled, (state, action) => {
      // console.log(action.payload)
      // state.sites = state.sites.filter(
      //   ({ id }) => id !== action.payload.id
      // );
      state.status = "idle";
    });
  },
});

export default siteSlice.reducer;

export const selectSite = (state) => state.sites.currSite;

export const selectAllSites = (state) => state.sites.sites;

export const selectSiteById = (state, siteId) =>
  state.sites.sites.find((site) => site.id === siteId);

export const selectAllHeadquarters = (state) => state.sites.headquarters;

export const selectHeadquartersById = (state, siteId) =>
  state.sites.headquarters.find((site) => site.id === siteId);

export const selectAllManufacturing = (state) => state.sites.manufacturing;

export const selectManufacturingById = (state, siteId) =>
  state.sites.manufacturing.find((site) => site.id === siteId);

export const selectAllWarehouse = (state) => state.sites.warehouse;

export const selectWarehouseById = (state, siteId) =>
  state.sites.warehouse.find((site) => site.id === siteId);
