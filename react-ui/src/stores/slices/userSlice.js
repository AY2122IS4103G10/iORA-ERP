import { createSlice } from "@reduxjs/toolkit";

const initialState = {user: null};
const loggedInUser = 
    {
        id: 1,
        name: "Ben Stone",
        email: "benstone828@gmail.com", 
        username: "BenStone828",
        availStatus: "true", 
        department: {
            id: 1,
            name: "Sales and Marketing"
        }, 
        company: {
            id: 1,
            name: "iORA Singapore",
        }
    };

const userSlice = createSlice({
    name: "user", 
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload;
        },
        logout(state, action) {
            state.user = null;
        }
    }
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;