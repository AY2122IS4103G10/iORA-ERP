import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  membershipTiers: [],
  status: "idle",
  error: null,
};

export const fetchMembershipTiers = createAsyncThunk(
  "membershipTiers/fetchMembershipTiers",
  async () => {
    const response = await api.getAll("sam/membershipTier/all");
    return response.data;
  }
);

const membershipTierSlice = createSlice({
  name: "membershipTiers",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchMembershipTiers.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchMembershipTiers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.membershipTiers = action.payload;
    });
    builder.addCase(fetchMembershipTiers.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

export default membershipTierSlice.reducer;

export const selectAllMembershipTiers = (state) =>
  state.membershipTiers.membershipTiers;
