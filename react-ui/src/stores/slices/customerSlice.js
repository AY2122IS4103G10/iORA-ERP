import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  customer: [],
  status: "idle",
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  "customer/fetchCustomers",
  async () => {
    const response = await api.getAll("admin/viewCustomers?search=");
    return response.data;
  }
);

export const addNewCustomer = createAsyncThunk(
  "customer/addNewCustomer",
  async (initialCustomer) => {
    const response = await api.create("admin/addCustomer", initialCustomer);
    return response.data;
  }
);

export const updateExistingCustomer = createAsyncThunk(
  "customer/updateExistingCustomer",
  async (existingCustomer) => {
    const response = await api.update("admin/editCustomer", existingCustomer);
    return response.data;
  }
);

export const deleteExistingCustomer = createAsyncThunk(
  "customer/deleteExistingCustomer",
  async (existingCustomerId) => {
    const response = await api.delete("admin/deleteCustomer", existingCustomerId);
    return response.data;
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchCustomers.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.customer = state.customer.concat(action.payload);
    });
    builder.addCase(fetchCustomers.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewCustomer.fulfilled, (state, action) => {
      state.customer.push(action.payload);
    });
    builder.addCase(updateExistingCustomer.fulfilled, (state, action) => {
      const {
        customerId,
        firstName,
        lastName,
        email,
        dob,
        password,
        contactNumber,
        membershipPoints,
        //membershipTier,
        storeCredit,
        availStatus
      } = action.payload;
      console.log(action.payload);
      const existingCustomer = state.customer.find((cus) => cus.customerId === customerId);
      if (existingCustomer) {
        existingCustomer.firstName = firstName;
        existingCustomer.email = email;
        existingCustomer.dob = dob;
        existingCustomer.lastName = lastName;
        existingCustomer.password = password;
        existingCustomer.availStatus = availStatus;
        existingCustomer.contactNumber = contactNumber;
        //existingCustomer.membershipTier = membershipTier;
        existingCustomer.membershipPoints = membershipPoints;
        existingCustomer.storeCredit = storeCredit;
      }
      // state.status = "idle";
    });
    builder.addCase(deleteExistingCustomer.fulfilled, (state, action) => {
      state.customer = state.customer.filter(
        ({ customerId }) => customerId !== action.payload.customerId
      );
      // state.status = "idle"
    });
  },
});

export default customerSlice.reducer;

export const selectAllCustomer = (state) => state.customer.customer;

export const selectCustomerById = (state, customerId) =>
  state.customer.customer.find((customer) => customer.customerId === customerId);