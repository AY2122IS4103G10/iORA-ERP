import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, employeeApi } from "../../environments/Api";

const initialState = {
  employee: [],
  status: "idle",
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async () => {
    const response = await api.getAll("admin/viewEmployees?search=");
    return response.data;
  }
);

export const addNewEmployee = createAsyncThunk(
  "employee/addNewEmployee",
  async (initialEmployee) => {
    const response = await api.create("admin/addEmployee", initialEmployee);
    return response.data;
  }
);

export const updateExistingEmployee = createAsyncThunk(
  "employee/updateExistingEmployee",
  async (existingEmployee) => {
    const response = await api.update("admin/editEmployee", existingEmployee);
    return response.data;
  }
);

export const deleteExistingEmployee = createAsyncThunk(
  "employee/deleteExistingEmployee",
  async (existingEmployeeId) => {
    const response = await employeeApi.deleteEmployee(existingEmployeeId);
    return response.data;
  }
);

export const enableEmployee = createAsyncThunk(
  "employee/enableEmployee",
  async (existingEmployeeId) => {
    const response = await employeeApi.enableEmployee(existingEmployeeId);
    return response.data;
  }
);

export const disableEmployee = createAsyncThunk(
  "employee/disableEmployee",
  async (existingEmployeeId) => {
    const response = await employeeApi.disableEmployee(existingEmployeeId);
    return response.data;
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchEmployees.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchEmployees.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.employee = action.payload;
    });
    builder.addCase(fetchEmployees.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewEmployee.fulfilled, (state, action) => {
      state.employee.push(action.payload);
    });
    builder.addCase(updateExistingEmployee.fulfilled, (state, action) => {
      const {
        id,
        name,
        email,
        salary,
        username,
        password,
        payType,
        jobTitle,
        department,
        company,
      } = action.payload;
      const existingEmployee = state.employee.find((emp) => emp.id === id);
      if (existingEmployee) {
        existingEmployee.name = name;
        existingEmployee.email = email;
        existingEmployee.salary = salary;
        existingEmployee.username = username;
        existingEmployee.password = password;
        existingEmployee.payType = payType;
        existingEmployee.jobTitle = jobTitle;
        existingEmployee.department = department;
        existingEmployee.company = company;
      }
    });
    builder.addCase(deleteExistingEmployee.fulfilled, (state, action) => {
      // state.employee = state.employee.filter(
      //   ({ employeeId }) => employeeId !== action.payload.id
      // );
      state.employee.status = "idle";
    });
    builder.addCase(enableEmployee.fulfilled, (state, action) => {
      const { id, availStatus } = action.payload;
      const existingEmployee = state.employee.find((emp) => emp.id === id);
      if (existingEmployee) {
        existingEmployee.availStatus = availStatus;
      }
    });
    builder.addCase(disableEmployee.fulfilled, (state, action) => {
      const { id, availStatus } = action.payload;
      const existingEmployee = state.employee.find((emp) => emp.id === id);
      if (existingEmployee) {
        existingEmployee.availStatus = availStatus;
      }
    });
  },
});

export default employeeSlice.reducer;

export const selectAllEmployee = (state) => state.employee.employee;

export const selectEmployeeById = (state, employeeId) =>
  state.employee.employee.find((employee) => employee.id === employeeId);
