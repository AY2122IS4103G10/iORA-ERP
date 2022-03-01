import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
  jobTitle: [],
  status: "idle",
  error: null,
};

export const fetchJobTitles = createAsyncThunk(
  "jobTitle/fetchJobTitles",
  async () => {
    const response = await api.getAll("admin/viewJobTitles?search=");
    return response.data;
  }
);

export const addNewJobTitle = createAsyncThunk(
  "jobTitle/addNewJobTitle",
  async (initialJobTitle) => {
    const response = await api.create("admin/addJobTitle", initialJobTitle);
    return response.data;
  }
);

export const updateExistingJobTitle = createAsyncThunk(
  "jobTitle/updateExistingJobTitle",
  async (existingJobTitle) => {
    const response = await api.update("admin/editJobTitle", existingJobTitle);
    return response.data;
  }
);

export const deleteExistingJobTitle = createAsyncThunk(
  "jobTitle/deleteExistingJobTitle",
  async (existingJobTitleId) => {
    const response = await api.deleteJobTitle(
      "admin/deleteEmployee",
      existingJobTitleId
    );
    return response.data;
  }
);

const jobTitleSlice = createSlice({
  name: "jobTitle",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchJobTitles.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchJobTitles.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.jobTitle = action.payload;
    });
    builder.addCase(fetchJobTitles.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(addNewJobTitle.fulfilled, (state, action) => {
      state.jobTitle.push(action.payload);
    });
    builder.addCase(updateExistingJobTitle.fulfilled, (state, action) => {
      const {
        jobTitleId,
        title,
        description,
        responsibility,
      } = action.payload;
      console.log(action.payload);
      const existingJobTitle = state.jobTitle.find((job) => job.jobTitleId === jobTitleId);
      if (existingJobTitle) {
        existingJobTitle.title = title;
        existingJobTitle.description = description;
        existingJobTitle.responsibility = responsibility;
      }
    });
    builder.addCase(deleteExistingJobTitle.fulfilled, (state, action) => {
      state.jobTitle = state.jobTitle.filter(
        ({ jobTitleId }) => jobTitleId !== action.payload.jobTitleId
      );
      // state.status = "idle"
    });
  },
});

export default jobTitleSlice.reducer;

export const selectAllJobTitle = (state) => state.jobTitle.jobTitle;

export const selectJobTitleById = (state, jobTitleId) =>
  state.jobTitle.jobTitle.find((jTitle) => jTitle.jobTitleId === jobTitleId);
