import { configureStore } from "@reduxjs/toolkit";
import userReducers from "./user/userSlice";

export const store = configureStore({
    reducer: { user: userReducers },
});
