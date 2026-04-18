import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/store/auth.slice";
import { accountReducer } from "../features/account/store/account.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        account: accountReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;