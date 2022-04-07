import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../environments/Api";

const guest = {
  id: -1,
  name: "Guest",
  email: "NA",
  payType: "MONTHLY",
  salary: 0,
  username: "guest",
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
  jobTitle: {
    responsibility: [],
  },
};

const initialUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : guest;
const initialStore = localStorage.getItem("siteId")
  ? JSON.parse(localStorage.getItem("siteId"))
  : 0;

const initialState = {
  user: { ...initialUser },
  loggedIn: localStorage.getItem("user") ? true : false,
  accessToken: "",
  refreshToken: "",
  responsibility: [],
  currSite: initialStore,
  status: "idle",
  currSiteStatus: "idle",
  error: "null",
};

export const login = createAsyncThunk("auth/login", async (credentials) => {
  try {
    const response = await authApi.login(
      credentials.username,
      credentials.password
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error.response.data);
  }
});

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

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (details) => {
    try {
      const response = await authApi.updateProfile(details);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.message);
    }
  }
);

// export const updateCurrSite = createAction("updateCurrSite");

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.loggedIn = false;
      state.user = { ...guest };
      state.accessToken = "";
      state.refreshToken = "";
      state.responsibility = [];
    },
    updateCurrSite(state, action) {
      if (action.payload) {
        state.currSite = action.payload;
        localStorage.setItem("siteId", action.payload);
      } else {
        state.currSite = localStorage.getItem("siteId")
          ? JSON.parse(localStorage.getItem("siteId"))
          : 0;
      }
      state.currSiteStatus = "succeeded";
    },
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      action.payload.department.jobTitles !== undefined &&
        delete action.payload.department.jobTitles;
      action.payload.company.departments !== undefined &&
        delete action.payload.company.departments;
      action.payload.company.vendors !== undefined &&
        delete action.payload.company.vendors;
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
    builder.addCase(loginJwt.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.responsibility = action.payload.responsibility;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.responsibility = action.payload.responsibility;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    });
    builder.addCase(refreshTokenJwt.fulfilled, (state, action) => {
      console.log(action.payload);
      state.status = "succeeded";
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("accessToken", action.payload.accessToken);
    });
    builder.addCase(loginJwt.rejected, (state, action) => {
      state.error = "Login failed";
    });
    builder.addCase(postLoginJwt.fulfilled, (state, action) => {
      state.user = { ...action.payload };
      state.loggedIn = true;
    });
    builder.addCase(updateCurrSite, (state, action) => {
      state.currSite = action.payload;
    });
  },
});

export const { logout, updateCurrSite } = userSlice.actions;

export const selectUserLoggedIn = (state) => state.user.loggedIn;

export const selectUser = (state) => {
  return { ...state?.user?.user };
};

export const selectUserId = (state) => state.user.user.id;

export const selectUserSite = (state) => state.user.currSite;

export const selectUserAccess = (state) =>
  state.user.user.jobTitle.responsibility;

export default userSlice.reducer;
