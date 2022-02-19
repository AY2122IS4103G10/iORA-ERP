import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { sitesApi } from "../../environments/Api";

import { api } from "../../environments/Api";

const initialState = {
  sites: [],
  currSite: null,
  status: "idle",
  error: null,
};

export const getAllSites = createAsyncThunk(
    "stocklevels/getAllSites",
    async () => {
        const response = await sitesApi.getAll();
        console.log(response.data);
        return response.data;
    }
);

export const getASite = createAsyncThunk(
  "stocklevels/getASite",
  async (id) => {
    const response = await sitesApi.getASite(id);
    return response.data;
  }
)
export const fetchSites = createAsyncThunk(
  "sites/fetchSites",
  async () => {
    const response = await api.getAll(`admin/viewSites`);
    return response.data;
  }
);

export const addNewSites = createAsyncThunk(
  "sites/addNewSites",
  async (storeType, initialSite) => {
    const response = await api.create(`admin/addSite/${storeType}`, initialSite);
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
    const response = await api.delete("admin/deleteSite", existingSiteId);
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
      state.sites = state.sites.concat(action.payload);
    });
    builder.addCase(fetchSites.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(getAllSites.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getAllSites.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.sites = state.sites.concat(action.payload);
    });
    builder.addCase(getAllSites.rejected, (state, action) => {
      state.status = "failed";
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
    });


    builder.addCase(addNewSites.fulfilled, (state, action) => {
      state.sites.push(action.payload)
    });
    builder.addCase(updateExistingSite.fulfilled, (state, action) => {
      const {
        siteId,
        name,
        description,
        price,
        onlineOnly,
        available,
        sites,
        productFields,
      } = action.payload;
      console.log(action.payload)
      const existingProd = state.sites.find(
        (prod) => prod.siteId === siteId
      );
      if (existingProd) {
        existingProd.name = name;
        existingProd.description = description;
        existingProd.price = price;
        existingProd.onlineOnly = onlineOnly;
        existingProd.available = available;
        existingProd.sites = sites;
        existingProd.productFields = productFields;
      }
      // state.status = "idle";
    });
    builder.addCase(deleteExistingSite.fulfilled, (state, action) => {
      state.sites = state.sites.filter(
        ({ siteId }) => siteId !== action.payload.siteId
      );
      // state.status = "idle"
    });
  },
});

export default siteSlice.reducer;

export const selectSite = (state) => state.sites.currSite;

export const selectAllSites = (state) => state.sites.sites;

export const selectSiteById = (state, siteId) =>
  state.sites.sites.find((site) => site.siteId === siteId);
