import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { sitesApi } from "../../environments/Api";

// const initialState = {
//     sites: [
//         {
//             id: 1,
//             siteCode: "ICO",
//             name: "iORA Compass One",
//             company: {
//                 id: 1,
//                 name: "iORA Singapore"
//             },
//         },
//         {
//             id: 2,
//             siteCode: "IOI",
//             name: "iORA IOI Mall",
//             company: {
//                 id: 2,
//                 name: "iORA Malaysia"
//             },
//         },
//         {
//             id: 3,
//             siteCode: "A544",
//             name: "Lalu Junction 8",
//             company: {
//                 id: 1,
//                 name: "iORA Singapore"
//             },
//         },
//     ],
//     status: "idle",
//     error: null,
// };

// export const fetchSites = createAsyncThunk(
//     "stocklevels/fetchSites",
//     async () => {
//         const response = await sitesApi.getAll();
//         console.log(response.data);
//         return response.data;
//     }
// )

// const siteSlice = createSlice({
//     name: "sites",
//     initialState,
//     reducer: {
//         ignore(state, action) {

//         },
//         extraReducers: (builder) => {
//             builder.addCase(fetchSites.pending, (state, action) => {
//               state.status = "loading";
//             });
//             builder.addCase(fetchSites.fulfilled, (state, action) => {
//               state.status = "succeeded";
//               state.products = state.sites.concat(action.payload);
//             });
//             builder.addCase(fetchSites.rejected, (state, action) => {
//               state.status = "failed";
//             });
//         },
//     }
// })

import { api } from "../../environments/Api";

const initialState = {
  sites: [],
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

export const selectAllSites = (state) => state.sites.sites;

export const selectSiteById = (state, siteId) =>
  state.sites.sites.find((site) => site.siteId === siteId);
