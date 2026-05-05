import { AuthService } from "../types/authTypes";
import apiClient from "./apiClient";

const authService : AuthService = {
    async login(data: { phoneNumber: string; password: string; }) {
        const response = await apiClient.post("/auth/login", data, {
            skipAuth: true
        });
        return response.data.data;
    },
    async logout(refreshToken: string) {
        const response = await apiClient.post("/auth/logout", {
            refreshToken: refreshToken
        });
        return response.data.data;
    },
    async register(data: {
        phoneNumber: string;
        password: string;
        fullName: string;
        gender: number;
        role: number;
    }) {
        const response = await apiClient.post("/auth/register", data, {
            skipAuth: true
        });
        return response.data.data;
    },
    async sendResetPasswordOtp(phoneNumber: string) {
        await apiClient.post("/auth/request-reset-password", {
            phoneNumber: phoneNumber
        }, {
            skipAuth: true
        });
    },
    async resetPassword(data: {
        phoneNumber: string;
        code: string;
        newPassword: string;
    }) {
        await apiClient.post("/auth/reset-password", data, {
            skipAuth: true
        });
    },
    async refreshToken(refreshToken: string) {
        const response = await apiClient.post("/auth/refresh-token", {
            refreshToken: refreshToken
        }, {
            skipAuth: true
        });
        return response.data.data;
    },
    async registerDeviceToken(data: { sessionToken: string, deviceToken: string}): Promise<void> {
        await apiClient.post("/auth/register-device", data);
    }
}

export default authService;