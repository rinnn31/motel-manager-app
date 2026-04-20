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

export const refreshToken = createAppThunk(
    'auth/refreshToken',
    async (payload: {refreshToken: string}) => {
        return await authService.refreshToken(payload.refreshToken);
    }
);

export const logout = createAppThunk(
    'auth/logout',
    async (payload: {refreshToken: string}) => {
        await authService.logout(payload.refreshToken);
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
            // Login cases
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.refreshToken = action.payload.refreshToken;
                state.accessToken = action.payload.accessToken;
                state.userId = action.payload.userId;
                state.loading = false;

                // Save auth data to storage
                storageService.setItem(AUTH_DATA_KEY, {
                    refreshToken: action.payload.refreshToken,
                    accessToken: action.payload.accessToken,
                    userId: action.payload.userId
                });
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
            })
            // Regsiter cases
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.refreshToken = action.payload.refreshToken;
                state.accessToken = action.payload.accessToken;
                state.userId = action.payload.userId;
                state.loading = false;

                // Save auth data to storage
                storageService.setItem(AUTH_DATA_KEY, {
                    refreshToken: action.payload.refreshToken,
                    accessToken: action.payload.accessToken,
                    userId: action.payload.userId
                });
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
            })
            // Refresh token cases
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.refreshToken = action.payload.refreshToken;
                state.accessToken = action.payload.accessToken;

                // Update auth data in storage
                storageService.setItem(AUTH_DATA_KEY, {
                    refreshToken: action.payload.refreshToken,
                    accessToken: action.payload.accessToken,
                    userId: state.userId
                });
            })
            .addCase(refreshToken.rejected, (state) => {
                state.refreshToken = null;
                state.accessToken = null;
                state.userId = null;
            })

            .addCase(logout.fulfilled, (state) => {
                state.refreshToken = null;
                state.accessToken = null;
                state.userId = null;

                // Remove auth data from storage
                storageService.removeItem(AUTH_DATA_KEY);
            });
    }
});

export const { setHydrate } = authSlice.actions;
export const authReducer = authSlice.reducer;
