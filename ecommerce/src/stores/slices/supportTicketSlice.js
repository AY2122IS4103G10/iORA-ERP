import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, ticketApi } from "../../environments/Api";

const initialState = {
  supportTickets: [],
  publicSupportTickets: [],
  userSupportTickets: [],
  listStatus: "idle",
  detailsStatus: "idle",
  error: null,
};

export const fetchSupportTickets = createAsyncThunk(
  "supportTickets/fetchSupportTickets",
  async () => {
    const response = await api.getAll("online/ticket/all");
    return response.data;
  }
);

export const fetchPublicSupportTickets = createAsyncThunk(
  "supportTickets/fetchPublicSupportTickets",
  async () => {
    const response = await api.getAll("online/ticket/public");
    return response.data;
  }
);

export const fetchUserSupportTickets = createAsyncThunk(
  "supportTickets/fetchUserSupportTickets",
  async (customerId) => {
    const response = await api.get("online/ticket/user", customerId);
    return response.data;
  }
);

export const createSupportTicket = createAsyncThunk(
  "supportTickets/createSupportTicket",
  async (supportTicket) => {
    const response = await api.create("online/ticket", supportTicket);
    return response.data;
  }
);

export const replySupportTicket = createAsyncThunk(
  "supportTickets/replySupportTicket",
  async ({ ticketId, name, body }) => {
    const response = await api.update(`online/ticket/reply/${ticketId}?name=${name}`, body);
    return response.data;
  }
);

export const resolveSupportTicket = createAsyncThunk(
  "supportTickets/resolveSupportTicket",
  async (ticketId) => {
    const response = await ticketApi.resolveTicket(ticketId);
    return response.data;
  }
);

const supportTicketSlice = createSlice({
  name: "supportTickets",
  initialState,
  extraReducers(builder) {
    builder.addCase(createSupportTicket.fulfilled, (state, action) => {
      state.listStatus = "idle";
    });
    builder.addCase(fetchSupportTickets.pending, (state, action) => {
      state.detailsStatus = "loading";
    });
    builder.addCase(fetchSupportTickets.fulfilled, (state, action) => {
      state.detailsStatus = "succeeded";
      state.supportTickets = action.payload;
    });
    builder.addCase(fetchSupportTickets.rejected, (state, action) => {
      state.detailsStatus = "failed";
    });
    builder.addCase(fetchPublicSupportTickets.pending, (state, action) => {
      state.listStatus = "loading";
    });
    builder.addCase(fetchPublicSupportTickets.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.publicSupportTickets = action.payload;
    });
    builder.addCase(fetchUserSupportTickets.rejected, (state, action) => {
      state.listStatus = "failed";
    });
    builder.addCase(fetchUserSupportTickets.pending, (state, action) => {
      state.listStatus = "loading";
    });
    builder.addCase(fetchUserSupportTickets.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.userSupportTickets = action.payload;
    });
    builder.addCase(fetchPublicSupportTickets.rejected, (state, action) => {
      state.listStatus = "failed";
    });
    builder.addCase(replySupportTicket.fulfilled, (state, action) => {
      state.detailsStatus = "idle";
    });
    builder.addCase(resolveSupportTicket.fulfilled, (state, action) => {
      const {
        id,
        status
      } = action.payload;
      const supportTicket = state.supportTickets.find((st) => st.id === id);
      if (supportTicket) {
        supportTicket.detailsStatus = status;
      }
    });
  },
});

export default supportTicketSlice.reducer;

export const selectPublicSupportTickets = (state) =>
  state.supportTickets.publicSupportTickets;

export const selectUserSupportTickets = (state) =>
  state.supportTickets.userSupportTickets;

export const selectTicketById = (state, ticketId) =>
  state.supportTickets.supportTickets.find((supportTicket) => supportTicket.id === ticketId);