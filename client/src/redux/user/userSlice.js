import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    currentUser: null,
    loading: false,
    error: null,
};
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        signInSuccess: (state, payload) => {
            state.loading = false;
            state.currentUser = payload;
            state.error = null;
        },
        signInFail: (state, payload) => {
            state.loading = false;
            state.currentUser = null;
            state.error = payload;
        },
        submitStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        submitSuccess: (state, payload) => {
            state.loading = false;
            state.error = null;
            state.currentUser = payload;
        },
        submitFail: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
    },
});

export const { signInStart, signInSuccess, signInFail, submitStart, submitSuccess, submitFail} = userSlice.actions;

export default userSlice.reducer;
