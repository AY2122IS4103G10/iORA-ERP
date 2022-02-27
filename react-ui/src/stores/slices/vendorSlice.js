import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";
const initialState = {
    vendors: [],
    status: "idle",
    error: null,
};
export const fetchVendors = createAsyncThunk(
    "vendors/fetchVendors",
    async () => {
        const response = await api.getAll("admin/viewVendors?search=");
        return response.data;
    }
);
export const addNewVendor = createAsyncThunk(
    "vendors/addNewVendor",
    async (initialVendor) => {
        const response = await api.create("admin/addVendor", initialVendor);
        return response.data;
    }
);
export const updateExistingVendor = createAsyncThunk(
    "vendors/updateExistingVendor",
    async (existingVendor) => {
        const response = await api.update(`admin/editVendor`, existingVendor);
        return response.data;
    }
);
export const deleteExistingVendor = createAsyncThunk(
    "vendors/deleteExistingVendor",
    async (existingVendorId) => {
        const response = await api.delete(
            "admin/deleteVendor?id=",
            existingVendorId
        );
        return response.data;
    }
);

const vendorSlice = createSlice({
    name: "vendors",
    initialState,
    extraReducers(builder) {
        builder.addCase(fetchVendors.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(fetchVendors.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.vendors = action.payload;
        });
        builder.addCase(fetchVendors.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(addNewVendor.fulfilled, (state, action) => {
            state.vendors.push(action.payload);
        });
        builder.addCase(updateExistingVendor.fulfilled, (state, action) => {
            const {
                id,
                companyName,
                telephone,
                description,
                email,
                address,
            } = action.payload;
            const existingVendor = state.vendors.find(
                (vendor) => vendor.id === id
            );
            if (existingVendor) {
                existingVendor.companyName = companyName;
                existingVendor.telephone = telephone;
                existingVendor.description = description;
                existingVendor.email = email;
                existingVendor.address = address;
            }
            // state.status = "idle";
        });
        builder.addCase(deleteExistingVendor.fulfilled, (state, action) => {
            state.vendors = state.vendors.filter(
                ({ id }) => id !== action.payload.id
            );
            // state.status = "idle"
        });
    },
});
export default vendorSlice.reducer;
export const selectAllVendors = (state) => state.vendors.vendors;
export const selectVendorById = (state, vendorId) =>
    state.vendors.vendors.find((vendor) => vendor.id === vendorId);