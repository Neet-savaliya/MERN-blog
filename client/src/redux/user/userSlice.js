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
        deleteStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
        deleteFail: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        signOutSuccess: (state) => {
            state.error = null;
            state.loading = false;
            state.currentUser = null;
        },
    },
});

export const {
    signInStart,
    signInSuccess,
    signInFail,
    submitStart,
    submitSuccess,
    submitFail,
    deleteStart,
    deleteSuccess,
    deleteFail,
    signOutSuccess
} = userSlice.actions;

export default userSlice.reducer;
