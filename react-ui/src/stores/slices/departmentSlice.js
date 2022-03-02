import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, departmentApi } from "../../environments/Api";

const initialState = {
  department: [],
  status: "idle",
  error: null,
};

export const fetchDepartments = createAsyncThunk(
  "department/fetchDepartments",
  async () => {
    const response = await api.getAll("admin/viewDepartments?search=");
    return response.data;
  }
);

export const addNewDepartment = createAsyncThunk(
  "department/addDepartment",
  async (initialDepartment) => {
    const response = await api.create("admin/addDepartment", initialDepartment);
    return response.data;
  }
);

export const updateExistingDepartment = createAsyncThunk(
  "department/updateExistingDepartment",
  async (existingDepartment) => {
    const response = await api.update(
      "admin/editDepartment",
      existingDepartment
    );
    return response.data;
  }
);

export const deleteExistingDepartment = createAsyncThunk(
  "department/deleteExistingDepartment",
  async (existingDepartmentId) => {
    const response = await departmentApi.deleteDepartment(existingDepartmentId);
    return response.data;
  }
);

const departmentSlice = createSlice({
  name: "department",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchDepartments.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchDepartments.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.department = action.payload;
    });
    builder.addCase(fetchDepartments.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewDepartment.fulfilled, (state, action) => {
      state.department.push(action.payload);
    });
    builder.addCase(updateExistingDepartment.fulfilled, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(deleteExistingDepartment.fulfilled, (state, action) => {
      state.status = "idle";
    });
  },
});

export default departmentSlice.reducer;

export const selectAllDepartment = (state) => state.department.department;

export const selectDepartmentById = (state, departmentId) =>
  state.department.department.find(
    (dpartment) => dpartment.id === departmentId
  );
