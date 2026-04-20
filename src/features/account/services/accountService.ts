import apiClient from "../../../services/apiClient";
import { AccountService, ChangePasswordRequest, UpdateProfileRequest, VerifyContactPointRequest } from "../types/account.types";

const accountService: AccountService = {
    getUserInfo: async () => {
        const response = await apiClient.get("/account/me");
        return response.data.data;
    },
    getUserInfoById: async (userId: string) => {
        const response = await apiClient.get(`/account/${userId}`);
        return response.data.data;
    },
    changeContactpoint: async (newPhoneNumber: string) => {
        await apiClient.patch("/account/me/change-contactpoint", null, {
            params : {
                newPhoneNumber: newPhoneNumber
            }
        });
    },
    changePassword: async (data: ChangePasswordRequest) => {
        await apiClient.patch("/account/me/change-password", data);
    },
    deleteAccount: async () => {
        await apiClient.delete("/account/me/delete");
    },
    updateProfile: async (data: UpdateProfileRequest) => {
        await apiClient.patch("/account/me/update-profile", data);
    },
    verifyContactPoint: async (data: VerifyContactPointRequest) => {
        await apiClient.post("/account/me/verify-contactpoint", data);
    },
    sendContactPointVerificationCode: async (phoneNumber: string) => {
        await apiClient.post("/account/me/send-contactpoint-otp", null, {
            params: {
                phoneNumber: phoneNumber
            }
        });
    }

}

export default accountService;