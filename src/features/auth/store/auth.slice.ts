import { createSlice } from "@reduxjs/toolkit";
import { LoginRequest, RegisterRequest, ResetPasswordRequest } from "../types/auth.types";
import authService from "../services/authService";
import createAppThunk from "../../../store/createAppThunk";
import storageService from "../../../services/storageService";
import { AUTH_DATA_KEY } from "../../../constants/storage.constants";

interface AuthState {
    refreshToken: string | null,
    accessToken: string | null,
    userId: string | null,
    loading: boolean
};

const initialState: AuthState = {
    refreshToken: null,
    accessToken: null,
    userId: null,
    loading: false
};

export const login = createAppThunk(
    'auth/login',
    async (payload: LoginRequest) => {
        return await authService.login(payload);
    }
);

export const register = createAppThunk(
    'auth/register',
    async (payload: RegisterRequest) => {
        return await authService.register(payload);
    }
);

export const sendResetPasswordOtp = createAppThunk(
    'auth/sendResetPasswordOtp',
    async (payload: {phoneNumber: string}) => {
        await authService.sendResetPasswordOtp(payload.phoneNumber);
    }
);

export const resetPassword = createAppThunk(
    'auth/resetPassword',
    async (payload: ResetPasswordRequest) => {
        await authService.resetPassword(payload);
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setHydrate: (state, action) => {
            state.refreshToken = action.payload.refreshToken;
            state.accessToken = action.payload.accessToken;
            state.userId = action.payload.userId;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.refreshToken = action.payload.refreshToken;
                state.accessToken = action.payload.accessToken;
                state.userId = action.payload.userId;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.refreshToken = action.payload.refreshToken;
                state.accessToken = action.payload.accessToken;
                state.userId = action.payload.userId;
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(sendResetPasswordOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendResetPasswordOtp.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendResetPasswordOtp.rejected, (state, action: any) => {
                state.loading = false;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
            });
    }
});

export const { setHydrate } = authSlice.actions;
export const authReducer = authSlice.reducer;
