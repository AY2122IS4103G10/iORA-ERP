import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    employee: [
      {
        name: "Alex Tang",
        department: "Customer Service - Online",
        companyCode: "PZNS-SS0129-AS",
        status: "Active",
        email: "xxxx@xmail.com",
        username: "xxxx",
        password: "password123",
        payrollPerMonth: 3000
      },
    ],
    status: "idle",
    error: null,
  };
const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {
        employeeAdded: {
        reducer(state, action) {
          state.employee.push(action.payload);
        },
        prepare(name, department, companyCode, status, email, username, password, payrollPerMonth) {
          return {
            payload: {
              id: nanoid(),
              name,
              department,
              companyCode,
              status,
              email,
              username,
              password,
              payrollPerMonth: parseFloat(payrollPerMonth)
            },
          };
        },
      },
      employeeUpdated(state, action) {
        const { name, department, companyCode, status, email, username, password, payrollPerMonth } =
          action.payload;
        const existingEmployee = state.employee.find((employee) => employee.id === id);
        if (existingEmployee) {
          existingEmployee.name = name;
          existingEmployee.department = department;
          existingEmployee.companyCode = companyCode;
          existingEmployee.status = status;
          existingEmployee.email = email;
          existingEmployee.username = username;
          existingEmployee.password = password;
          existingEmployee.payrollPerMonth = payrollPerMonth;
        }
      },
      employeeDeleted(state, action) {
        state.employee.filter((employee) => employee !== action.payload);
      },
    },
  });
  
  export const { employeeAdded, employeeUpdated, employeeDeleted } = employeeSlice.actions;
  
  export default employeeSlice.reducer;
  
  export const selectAllEmployee = (state) => state.employee.employee;
  
  export const selectEmployeeById = (state, employeeId) =>
    state.employee.employee.find((employee) => employee.id === employeeId);