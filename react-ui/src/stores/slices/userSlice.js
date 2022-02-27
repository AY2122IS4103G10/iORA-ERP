import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import { authApi } from "../../environments/Api";

const guest = {
  id: -1,
  name: "Guest",
  email: "NA",
  salary: 0,
  username: "guest",
  salt: "",
  password: "",
  availStatus: "true",
  department: {
    id: 1,
    name: "Sales and Marketing",
    jobTitles: [],
  },
  company: {
    id: 1,
    name: "iORA Singapore",
  },
};

const initialUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : guest;

const initialState = {
  user: { ...initialUser },
  loggedIn: localStorage.getItem("user") ? true : false,
  currSite: 0, //to be updated when login is finalised
  status: "idle",
  error: "null",
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials) => {
      const response = await authApi.login(
        credentials.username,
        credentials.password
      );
      if (response.data === "") {
        return Promise.reject(response.error);
      }
      return response.data;
  }
);

export const updateCurrSite = createAction('updateCurrSite');

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
      action.payload.department.jobTitles !== undefined && delete action.payload.department.jobTitles;
      action.payload.company.departments !== undefined && delete action.payload.company.departments;
      action.payload.company.vendors !== undefined && delete action.payload.company.vendors;
      action.payload.salt !== undefined && delete action.payload.salt;
      action.payload.password !== undefined && delete action.payload.password;
      state = {
        ...state,
        user: { ...action.payload },
        status: "succeeded",
        loggedIn: true,
      };
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = "Login failed";
    });
    builder.addCase(updateCurrSite, (state, action) => {
      state.currSite = action.payload;
    });
  },
});

export const { logout } = userSlice.actions;

export const selectUserLoggedIn = (state) => state.user.loggedIn;

export const selectUser = (state) => state.user.user;

export const selectUserId = (state) => state.user.user.id;

export const selectUserStore = (state) => state.user.currStore;

export const selectUserSite = (state) => state.user.currSite;

export const selectUserAccess = (state) =>
  state.user.user.jobTitle.responsibility;

export default userSlice.reducer;
