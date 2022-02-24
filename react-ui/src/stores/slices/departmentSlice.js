import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  department: [
    {
      id: 1,
      name: "Sales",
    },
  ],
  status: "idle",
  error: null,
};

export const fetchDepartments = createAsyncThunk(
  "department/fetchDepartments",
  async () => {
    const response = await api.getAll("admin/viewDepartments/all");
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
      const response = await api.update("admin/editDepartment", existingDepartment);
      return response.data;
    }
  );
  
  export const deleteExistingDepartment = createAsyncThunk(
    "department/deleteExistingDepartment",
    async (existingDepartmentId) => {
      const response = await api.delete("admin/deleteDepartment", existingDepartmentId);
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
      state.department = state.department.concat(action.payload);
    });
    builder.addCase(fetchDepartments.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewDepartment.fulfilled, (state, action) => {
      state.department.push(action.payload);
    });
    builder.addCase(updateExistingDepartment.fulfilled, (state, action) => {
      const {
        departmentId,
        name,
      } = action.payload;
      console.log(action.payload);
      const existingDepartment = state.department.find(
        (department) => department.departmentId === departmentId
      );
      if (existingDepartment) {
        existingDepartment.name = name;
      }
      // state.status = "idle";
    });
    builder.addCase(deleteExistingDepartment.fulfilled, (state, action) => {
      state.department = state.department.filter(
        ({ departmentId }) => departmentId !== action.payload.departmenteId
      );
      // state.status = "idle"
    });
  },
});

export default departmentSlice.reducer;

export const selectAllDepartment = (state) => state.department.department;

export const selectDepartmentById = (state, departmentId) =>
  state.department.department.find((dpartment) => dpartment.departmentId === departmentId);
