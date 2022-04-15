import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, ticketApi } from "../../environments/Api";

const initialState = {
  supportTickets: [],
  status: "idle",
  error: null,
};

export const fetchSupportTickets = createAsyncThunk(
  "supportTickets/fetchSupportTickets",
  async () => {
    const response = await api.getAll("sam/ticket/all");
    return response.data;
  }
);

export const replySupportTicket = createAsyncThunk(
  "supportTickets/replySupportTicket",
  async ({ ticketId, name, body }) => {
    const response = await api.update(
      `sam/ticket/reply/${ticketId}?name=${name}`,
      body
    );
    return response.data;
  }
);

export const resolveSupportTicket = createAsyncThunk(
  "supportTickets/resolveSupportTicket",
  async (ticketId) => {
    try {
      const response = await ticketApi.resolveTicket(ticketId);
      return response.data;
    } catch (err) {
      return Promise.reject(err.response.data);
    }
  }
);

export const deleteSupportTicket = createAsyncThunk(
  "supportTickets/deleteSupportTicket",
  async (ticketId) => {
    const response = await api.delete("sam/ticket/delete", ticketId);
    return response.data;
  }
);

const supportTicketSlice = createSlice({
  name: "supportTickets",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchSupportTickets.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchSupportTickets.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.supportTickets = action.payload;
    });
    builder.addCase(fetchSupportTickets.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(replySupportTicket.fulfilled, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(resolveSupportTicket.fulfilled, (state, action) => {
      const { id, status } = action.payload;
      const supportTicket = state.supportTickets.find((st) => st.id === id);
      if (supportTicket) {
        supportTicket.status = status;
      }
    });
    builder.addCase(deleteSupportTicket.fulfilled, (state, action) => {
      state.status = "idle";
    });
  },
});

export default supportTicketSlice.reducer;

export const selectAllSupportTickets = (state) =>
  state.supportTickets.supportTickets;

export const selectTicketById = (state, ticketId) =>
  state.supportTickets.supportTickets.find(
    (supportTicket) => supportTicket.id === ticketId
  );
