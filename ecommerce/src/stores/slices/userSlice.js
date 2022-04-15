import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, onlineOrderApi } from "../../environments/Api";
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
    const response = await api.update("online/profile/edit", user);
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

export const fetchCustomer = createAsyncThunk(
  "customers/fetchCustomer",
  async (data) => {
    const response = await api.get("sam/customer/view", data);
    return response.data;
  }
);

export const fetchCustomerByEmail = createAsyncThunk(
  "customers/fetchCustomerByEmail",
  async (data) => {
    const response = await api.get("sam/customer/email", data);
    return response.data;
  }
);

export const cancelOrder = createAsyncThunk(
  "customers/cancelOrder",
  async (data) => {
    try {
      const response = await onlineOrderApi.cancelOrder(
        data.orderId,
        data.customerId
      );
      return response.data;
    } catch (err) {
      return Promise.reject(err.response.data);
    }
  }
);

export const completeOrder = createAsyncThunk(
  "customers/completeOrder",
  async (data) => {
    try {
      const response = await onlineOrderApi.completeOrder(data);
      return response.data;
    } catch (err) {
      return Promise.reject(err.response.data);
    }
  }
);

export const createSupportTicket = createAsyncThunk(
  "customers/createSupportTicket",
  async (supportTicket) => {
    try {
      const response = await api.create("online/ticket", supportTicket);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);

export const redeemPoints = createAsyncThunk(
  "customers/redeemPoints",
  async (data) => {
    try {
      const response = await api.get(
        "online/redeemPoints",
        `${data.email}/${data.amount}`
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
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
      state.user = { ...action.payload };
      state.loggedIn = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      // action.payload.password !== undefined && delete action.payload.password;
      // state.user = {...action.payload};
      state.status = "succeeded";
      // state.loggedIn = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = "Register failed";
    });
    builder.addCase(updateAccount.fulfilled, (state, action) => {
      action.payload.password !== undefined && delete action.payload.password;
      state.user = { ...action.payload };
      state.status = "succeeded";
    });
    builder.addCase(updateAccount.rejected, (state, action) => {
      state.error = "Update failed";
    });
    builder.addCase(getCurrentSpending.fulfilled, (state, action) => {
      state.currSpend = action.payload;
    });
    builder.addCase(fetchCustomer.fulfilled, (state, action) => {
      action.payload.password !== undefined && delete action.payload.password;
      state.user = { ...action.payload };
      state.status = "succeeded";
    });
    builder.addCase(fetchCustomerByEmail.fulfilled, (state, action) => {
      action.payload.password !== undefined && delete action.payload.password;
      state.user = { ...action.payload };
      state.status = "succeeded";
    });
    builder.addCase(cancelOrder.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(cancelOrder.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      const order = state.user.orders.find(
        (order) => order.id === action.payload.id
      );
      if (order) {
        order.statusHistory = action.payload.statusHistory;
      }
      state.status = "succeeded";
    });
    builder.addCase(completeOrder.fulfilled, (state, action) => {
      const order = state.user.orders.find(
        (order) => order.id === action.payload.id
      );
      if (order) {
        order.statusHistory = action.payload.statusHistory;
      }
      state.status = "succeeded";
    });

    builder.addCase(createSupportTicket.fulfilled, (state, action) => {
      console.log(action.payload);
      state.user.supportTickets.push({
        ...action.payload,
      });
      state.status = "succeeded";
    });
    builder.addCase(redeemPoints.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(redeemPoints.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(redeemPoints.fulfilled, (state, action) => {
      state.user = { ...action.payload };
      state.status = "succeeded";
    });
  },
});

export const { logout } = userSlice.actions;

export const selectUserLoggedIn = (state) => state.user.loggedIn;

export const selectUser = (state) => state.user.user;

export const selectUserId = (state) => state.user.user.id;

export const selectUserStore = (state) => state.user.currStore;

export const selectCurrSpend = (state) => state.user.currSpend;

export const selectUserOrders = (state) => state.user.user.orders;

export const selectUserTickets = (state) => state.user.user.supportTickets;

export const selectUserOrderById = (state, orderId) =>
  state.user.user.orders.find((order) => order.id === orderId);

export default userSlice.reducer;
