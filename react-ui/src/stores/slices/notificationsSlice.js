import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../environments/Api";

const initialState = {
    notifications: [],
    status: "idle"
};

export const getNotifications = createAsyncThunk(
    "notifications/getNotifications",
    async (siteId) => {
        const response = await api.get("admin/noti", siteId);
        return response.data;
    }
);

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    extraReducers(builder) {
        builder.addCase(getNotifications.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(getNotifications.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.notifications = state.notifications.concat(action.payload);
        });
        builder.addCase(getNotifications.rejected, (state, action) => {
            state.status = "failed";
        });
    }
})

export default notificationsSlice.reducer;

export const selectNotifications = (state) => state.notifications.notifications;