import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";
import { authApi } from "../../environments/Api";

const guest = {
  id: -1,
  firstName: "Guest",
  lastName: "1",
  contactNo: "",
  dob: "",
  email: "NA",
  username: "guest",
  salt: "",
  password: "",
};

const initialUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : guest;

const initialState = {
  user: { ...initialUser },
  loggedIn: localStorage.getItem("user") ? true : false,
  currStore: 0, //to be updated when login is finalised
  status: "idle",
  error: "null",
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const response = await authApi.login(email, password);
    if (response.data === "") {
      return Promise.reject(response.error);
    }
    return response.data;
  }
);

export const register = createAsyncThunk("auth/register", async (user) => {
  const response = await authApi.register(user);
  if (response.data === "") {
    return Promise.reject(response.error);
  }
  return response.data;
});

export const updateAccount = createAsyncThunk("auth/updateAccount", async (user) => {
  const response = await api.create("/online/profile/edit", user);
  if (response.data === "") {
    return Promise.reject(response.error);
  }
  return response.data;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("user");
      state.loggedIn = false;
      state.user = { ...guest };
    },
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      action.payload.salt !== undefined && delete action.payload.salt;
      action.payload.hashPass !== undefined && delete action.payload.hashPass;
      state.user = action.payload;
      state.status = "succeeded";
      state.loggedIn = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = "Login failed";
    });
    builder.addCase(register.fulfilled, (state, action) => {
      console.log(action.payload)
      action.payload.salt !== undefined && delete action.payload.salt;
      action.payload.hashPass !== undefined && delete action.payload.hashPass;
      state.user = action.payload;
      state.status = "succeeded";
      state.loggedIn = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = "Register failed";
    });
  },
});

export const { logout } = userSlice.actions;

export const selectUserLoggedIn = (state) => state.user.loggedIn;

export const selectUser = (state) => state.user.user;

export const selectUserId = (state) => state.user.user.id;

export const selectUserStore = (state) => state.user.currStore;

export default userSlice.reducer;
