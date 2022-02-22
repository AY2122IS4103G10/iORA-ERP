import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  employees: [],
  status: "idle",
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    const response = await api.getAll("admin/employee");
    return response.data;
  }
);

export const addNewEmployee = createAsyncThunk(
  "employee/addNewEmployee",
  async (initialEmployee) => {
    const response = await api.create("admin/employee", initialEmployee);
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
    const response = await api.delete("admin/employee", existingEmployeeId);
    return response.data;
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchEmployee.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchEmployee.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.employee = state.employee.concat(action.payload);
    });
    builder.addCase(fetchEmployee.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewEmployee.fulfilled, (state, action) => {
      state.employee.push(action.payload);
    });
    builder.addCase(updateExistingEmployee.fulfilled, (state, action) => {
      const {
        employeeId,
        name,
        email,
        salary,
        username,
        password,
        availStatus,
        payType,
        jobTitle,
        department
      } = action.payload;
      console.log(action.payload);
      const existingEmployee = state.employee.find((emp) => emp.employeeId === employeeId);
      if (existingEmployee) {
        existingEmployee.name = name;
        existingEmployee.email = email;
        existingEmployee.salary = salary;
        existingEmployee.username = username;
        existingEmployee.password = password;
        existingEmployee.availStatus = availStatus;
        existingEmployee.payType = payType;
        existingEmployee.jobTitle = jobTitle;
        existingEmployee.department = department;
      }
      // state.status = "idle";
    });
    builder.addCase(deleteExistingCompany.fulfilled, (state, action) => {
      state.employee = state.employee.filter(
        ({ employeeId }) => employeeId !== action.payload.employeeId
      );
      // state.status = "idle"
    });
  },
});

export default employeeSlice.reducer;

export const selectAllEmployee = (state) => state.employee.employee;

export const selectEmployeeById = (state, employeeId) =>
  state.employee.employee.find((employee) => employee.employeeId === employeeId);

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     employee: [
//       {
//         name: "Alex Tang",
//         department: "Customer Service - Online",
//         companyCode: "PZNS-SS0129-AS",
//         status: "Active",
//         email: "xxxx@xmail.com",
//         username: "xxxx",
//         password: "password123",
//         payrollPerMonth: 3000
//       },
//     ],
//     status: "idle",
//     error: null,
//   };
// const employeeSlice = createSlice({
//     name: "employee",
//     initialState,
//     reducers: {
//         employeeAdded: {
//         reducer(state, action) {
//           state.employee.push(action.payload);
//         },
//         prepare(name, department, companyCode, status, email, username, password, payrollPerMonth) {
//           return {
//             payload: {
//               id: nanoid(),
//               name,
//               department,
//               companyCode,
//               status,
//               email,
//               username,
//               password,
//               payrollPerMonth: parseFloat(payrollPerMonth)
//             },
//           };
//         },
//       },
//       employeeUpdated(state, action) {
//         const { name, department, companyCode, status, email, username, password, payrollPerMonth } =
//           action.payload;
//         const existingEmployee = state.employee.find((employee) => employee.id === id);
//         if (existingEmployee) {
//           existingEmployee.name = name;
//           existingEmployee.department = department;
//           existingEmployee.companyCode = companyCode;
//           existingEmployee.status = status;
//           existingEmployee.email = email;
//           existingEmployee.username = username;
//           existingEmployee.password = password;
//           existingEmployee.payrollPerMonth = payrollPerMonth;
//         }
//       },
//       employeeDeleted(state, action) {
//         state.employee.filter((employee) => employee !== action.payload);
//       },
//     },
//   });
  
//   export const { employeeAdded, employeeUpdated, employeeDeleted } = employeeSlice.actions;
  
//   export default employeeSlice.reducer;
  
//   export const selectAllEmployee = (state) => state.employee.employee;
  
//   export const selectEmployeeById = (state, employeeId) =>
//     state.employee.employee.find((employee) => employee.id === employeeId);

