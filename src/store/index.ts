import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth/authSlice";
import { accountReducer } from "./account/accountSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        account: accountReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;