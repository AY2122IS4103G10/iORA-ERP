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

export const addNewMembershipTier = createAsyncThunk(
  "membershipTiers/addNewMembershipTier",
  async (newMembershipTier) => {
    const response = await api.create(
      "sam/membershipTier/create",
      newMembershipTier
    );
    return response.data;
  }
);

export const updateExistingMembershipTier = createAsyncThunk(
  "membershipTiers/updateExistingMembershipTier",
  async (existingMembershipTier) => {
    const response = await api.update(
      "sam/membershipTier/edit",
      existingMembershipTier
    );
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
    builder.addCase(addNewMembershipTier.fulfilled, (state, action) => {
      state.membershipTiers.push(action.payload);
      state.membershipTiers.sort((x, y) => x.multiplier - y.multiplier);
    });
    builder.addCase(updateExistingMembershipTier.fulfilled, (state, action) => {
      state.status = "idle";
    });
  },
});

export default membershipTierSlice.reducer;

export const selectAllMembershipTiers = (state) =>
  state.membershipTiers.membershipTiers;

export const selectMembershipTierByName = (state, membershipTierName) =>
  state.membershipTiers.membershipTiers.find(
    (mt) => mt.name === membershipTierName
  );
