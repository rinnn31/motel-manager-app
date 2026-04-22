import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "../../types/accountTypes";
import createAppThunk from "../createAppThunk";
import accountService from "../../services/accountService";

interface AccountState {
    user: UserInfo | null;
    loading: boolean;
    error: boolean
}

const initialState: AccountState = {
    user: null,
    loading: false,
    error: false,
};

export const fetchUserInfo = createAppThunk<UserInfo, void>(
    "account/fetchUserInfo",
    async (_, thunkAPI) => {
        return await accountService.getUserInfo();
    }
)

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
            .addCase(fetchUserInfo.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.error = true;
                state.loading = false;
            });
    }
});

export const { clearAccount, updateProfile } = accountSlice.actions;

export const accountReducer = accountSlice.reducer;