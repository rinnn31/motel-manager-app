import { AuthService, LoginRequest, RegisterRequest, ResetPasswordRequest } from "../types/auth.types";
import apiClient from "../../../services/apiClient";

const authService : AuthService = {
    login: async (data: LoginRequest) => {
        const response =  await apiClient.post("/auth/login", data, {
            skipAuth: true
        });
        return response.data.data;
    },
    logout: async (refreshToken: string) => {
        const response = await apiClient.post("/auth/logout", {
            params : {
                refreshToken: refreshToken
            }
        });
        return response.data.data;
    },
    register: async (data: RegisterRequest) => {
        const response = await apiClient.post("/auth/register", data, {
            skipAuth: true
        });
        return response.data.data;
    },
    sendResetPasswordOtp: async (phoneNumber: string) => {
        await apiClient.post("/auth/send-reset-password-otp", null, {
            params: {
                phoneNumber: phoneNumber
            },
            skipAuth: true
        });
    },
    resetPassword: async (data: ResetPasswordRequest) => {
        await apiClient.post("/auth/reset-password", data, {
            skipAuth: true
        });
    },
    refreshToken: async (refreshToken: string) => {
        const response = await apiClient.post("/auth/refresh",  null, {
            params: {
                refreshToken: refreshToken
            },
            skipAuth: true
        });
        return response.data.data;
    }
}

export default authService;