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
  password: ""
};

const initialUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : guest;

const initialState = {
  user: { ...initialUser },
  loggedIn: localStorage.getItem("user") ? true : false,
  currStore: 0, //to be updated when login is finalised
  currSpend: 0,
  status: "idle",
  error: "null",
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    try {
      const response = await authApi.login(email, password);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);

export const loginJwt = createAsyncThunk(
  "auth/loginJwt",
  async (credentials) => {
    try {
      const response = await authApi.loginJwt(credentials);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);

export const postLoginJwt = createAsyncThunk(
  "auth/postLoginJwt",
  async (accessToken) => {
    try {
      const response = await authApi.postLoginJwt(accessToken);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);

export const refreshTokenJwt = createAsyncThunk(
  "auth/refreshTokenJwt",
  async (refreshToken) => {
    try {
      const response = await authApi.refreshTokenJwt(refreshToken);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.message);
    }
  }
);

export const register = createAsyncThunk("auth/register", async (user) => {
  try {
    const response = await authApi.register(user);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
});

export const updateAccount = createAsyncThunk(
  "auth/updateAccount",
  async (user) => {
    const response = await api.update("/online/profile/edit", user);
    if (response.data === "") {
      return Promise.reject(response.error);
    }
    return response.data;
  }
);

export const fetchAnOrder = createAsyncThunk(
  "user/getUserOrder",
  async (orderId) => {
    const response = await api.get("/online/history", orderId);
    if (response.data === "") {
      return Promise.reject(response.error);
    }
    return response.data;
  }
);

export const getCurrentSpending = createAsyncThunk(
  "customers/getCurrentSpending",
  async (customerId) => {
    const response = await api.get("store/member/spending", customerId);
    return response.data;
  }
);

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
      state.error = action.error;
    });
    builder.addCase(loginJwt.fulfilled, (state, action) => {
      state = {
        ...state,
        user: { ...action.payload },
        status: "succeeded",
        loggedIn: true,
      };
    });
    builder.addCase(loginJwt.rejected, (state, action) => {
      state.error = "Login failed";
    });
    builder.addCase(postLoginJwt.fulfilled, (state, action) => {
      console.log(action.payload)
      state.user = { ...action.payload };
      state.loggedIn = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      action.payload.password !== undefined && delete action.payload.password;
      state.user = action.payload;
      state.status = "succeeded";
      state.loggedIn = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = "Register failed";
    });
    builder.addCase(updateAccount.fulfilled, (state, action) => {
      action.payload.password !== undefined && delete action.payload.password;
      state.user = action.payload;
      state.status = "succeeded";
    });
    builder.addCase(updateAccount.rejected, (state, action) => {
      state.error = "Update failed";
    });
    builder.addCase(getCurrentSpending.fulfilled, (state, action) => {
      state.currSpend = action.payload;
    });
  },
});

export const { logout } = userSlice.actions;

export const selectUserLoggedIn = (state) => state.user.loggedIn;

export const selectUser = (state) => state.user.user;

export const selectUserId = (state) => state.user.user.id;

export const selectUserStore = (state) => state.user.currStore;

export const selectCurrSpend = (state) => state.user.currSpend;

export default userSlice.reducer;
