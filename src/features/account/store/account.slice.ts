import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "../types/account.types";
import { login, register } from "../../auth/store/auth.slice";

interface AccountState {
    user: UserInfo | null;
}

const initialState: AccountState = {
    user: null
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        clearAccount: (state) => {
            state.user = null;
        },
        updateProfile: (state, action: { payload }) => {
            state.user = {
                ...state.user,
                ...action.payload
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Add case for login success, its result contains user info, so we can set it to state
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.userInfo;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload.userInfo;
            })
    }
});

export const { clearAccount, updateProfile } = accountSlice.actions;

export const accountReducer = accountSlice.reducer;