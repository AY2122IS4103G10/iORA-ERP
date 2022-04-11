import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api, customerApi, posApi} from "../../environments/Api";

const initialState = {
  customers: [],
  ssCustomer: null,
  status: "idle",
  error: null,
};

export const fetchCustomers = createAsyncThunk("customers/fetchCustomers", async () => {
  const response = await api.getAll("sam/customer/view/all");
  return response.data;
});

export const getCustomerByPhone = createAsyncThunk(
  "customers/getCustomerByPhone",
  async (phone) => {
    const response = await api.get("sam/customer/search", phone);
    return response.data;
  }
);

export const addNewCustomer = createAsyncThunk(
  "customers/addNewCustomer",
  async (initialCustomer) => {
    const response = await api.create("sam/customer/create", initialCustomer);
    // Email to ask customer to change password
    return response.data;
  }
);

export const updateExistingCustomer = createAsyncThunk(
  "customers/updateExistingCustomer",
  async (existingCustomer) => {
    const response = await api.update("sam/customer/edit", existingCustomer);
    return response.data;
  }
);

export const blockExistingCustomer = createAsyncThunk(
  "customers/blockExistingCustomer",
  async (existingCustomerId) => {
    const response = await customerApi.blockCustomer(existingCustomerId);
    return response.data;
  }
);

export const unblockExistingCustomer = createAsyncThunk(
  "customers/unblockExistingCustomer",
  async (existingCustomerId) => {
    const response = await customerApi.unblockCustomer(existingCustomerId);
    return response.data;
  }
);

export const getCurrentSpending = createAsyncThunk(
  "customers/getCurrentSpending",
  async (customerId) => {
    const response = await posApi.getCurrentSpending(customerId);
    return response.data;
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    removeSSCustomer(state) {
      state.ssCustomer = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(getCustomerByPhone.fulfilled, (state, action) => {
      state.ssCustomer = action.payload[0];
    });
    builder.addCase(getCurrentSpending.fulfilled, (state, action) => {
      state.ssCustomer = {currSpend: action.payload, ...state.ssCustomer};
    });
    builder.addCase(fetchCustomers.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.customers = action.payload;
    });
    builder.addCase(fetchCustomers.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewCustomer.fulfilled, (state, action) => {
      state.customers.push(action.payload);
    });
    builder.addCase(updateExistingCustomer.fulfilled, (state, action) => {
      /*const {
        id,
        firstName,
        lastName,
        email,
        dob,
        password,
        contactNumber,
        membershipPoints,
        //membershipTier,
        availStatus,
      } = action.payload;
      const existingCustomer = state.customers.find((cus) => cus.id === id);
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
      }*/
      state.status = "idle";
    });
    builder.addCase(blockExistingCustomer.fulfilled, (state, action) => {
      const {id, availStatus} = action.payload;
      const existingCustomer = state.customers.find((cus) => cus.id === id);
      if (existingCustomer) {
        existingCustomer.availStatus = availStatus;
      }
      // state.status = "idle";
    });
    builder.addCase(unblockExistingCustomer.fulfilled, (state, action) => {
      const {id, availStatus} = action.payload;
      const existingCustomer = state.customers.find((cus) => cus.id === id);
      if (existingCustomer) {
        existingCustomer.availStatus = availStatus;
      }
      // state.status = "idle";
    });
  },
});

export default customerSlice.reducer;

export const {removeSSCustomer} = customerSlice.actions;

export const selectAllCustomers = (state) => state.customers.customers;

export const selectCustomerById = (state, customerId) =>
  state.customers.customers.find((customer) => customer.id === customerId);

export const selectSSCustomer = (state) => state.customers.ssCustomer;
