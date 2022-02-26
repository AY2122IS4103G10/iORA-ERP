import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  membershipTier: [],
  status: "idle",
  error: null,
};
// {
//     "name": "PLATINUM",
//     "multiplier": "0.06",
//     "threshold": {
//       "SGD,Singapore Dollar": "1500",
//       "RM,Malaysian Ringgit": "4500"
//     }
//   }
  

export const fetchMembershipTiers = createAsyncThunk(
  "membershipTier/fetchMembershipTiers",
  async () => {
    const response = await api.getAll("admin/viewMembershipTiers?search=");
    return response.data;
  }
);

export const addNewMembershipTier = createAsyncThunk(
  "membershipTier/addNewMembershipTier",
  async (initialMembershipTier) => {
    const response = await api.create("admin/addMembershipTier", initialMembershipTier);
    return response.data;
  }
);

export const updateExistingMembershipTier = createAsyncThunk(
  "membershipTier/updateExistingMembershipTier",
  async (existingMembershipTier) => {
    const response = await api.update("admin/editMembershipTier", existingMembershipTier);
    return response.data;
  }
);

export const deleteExistingMembershipTier = createAsyncThunk(
  "membershipTier/deleteExistingMembershipTier",
  async (existingMembershipTierId) => {
    const response = await api.delete("admin/deleteMembershipTier", existingMembershipTierId);
    return response.data;
  }
);

const membershipTierSlice = createSlice({
  name: "membershipTier",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchMembershipTiers.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchMembershipTiers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.membershipTier = state.membershipTier.concat(action.payload);
    });
    builder.addCase(fetchMembershipTiers.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewMembershipTier.fulfilled, (state, action) => {
      state.membershipTier.push(action.payload);
    });
    builder.addCase(updateExistingMembershipTier.fulfilled, (state, action) => {
      const {
        membershipTierId,
        name,
        multiplier,
        threshold,
      } = action.payload;
      console.log(action.payload);
      const existingMembershipTier = state.membershipTier.find((emp) => emp.membershipTierId === membershipTierId);
      if (existingMembershipTier) {
        existingMembershipTier.name = name;
        existingMembershipTier.multiplier = multiplier;
        existingMembershipTier.threshold = threshold;
      }
      // state.status = "idle";
    });
    builder.addCase(deleteExistingMembershipTier.fulfilled, (state, action) => {
      state.membershipTier = state.membershipTier.filter(
        ({ membershipTierId }) => membershipTierId !== action.payload.membershipTierId
      );
      // state.status = "idle"
    });
  },
});

export default membershipTierSlice.reducer;

export const selectAllMembershipTier = (state) => state.membershipTier.membershipTier;

export const selectMembershipTierById = (state, membershipTierId) =>
  state.membershipTier.membershipTier.find((membershipTier) => membershipTier.membershipTierId === membershipTierId);