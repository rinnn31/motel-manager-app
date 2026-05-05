import apiClient from "./apiClient";
import { AccountService } from "../types/accountTypes";

const accountService: AccountService = {
    getUserInfo: async () => {
        const response = await apiClient.get("/account/me");
        console.log("Fetched user info: ", response.data.data);
        return response.data.data;
    },
    getUserInfoById: async (userId: string) => {
        const response = await apiClient.get(`/account/${userId}`);
        return response.data.data;
    },
    changeContactpoint: async (phoneNumber: string) => {
        await apiClient.patch("/account/me/contactpoint", {
            phoneNumber: phoneNumber
        });
    },
    changePassword: async (data: {
        oldPassword: string,
        newPassword: string
    }) => {
        await apiClient.patch("/account/me/password", data);
    },
    deleteAccount: async () => {
        await apiClient.delete("/account/me");
    },
    updateProfile: async (data: {
        fullName: string,
        gender: number
    }) => {
        await apiClient.patch("/account/me", data);
    },
    verifyContactPoint: async (data: {
        phoneNumber: string,
        otp: string
    }) => {
        await apiClient.post("/account/me/contactpoint/verify", data);
    },
    sendContactPointVerificationCode: async (phoneNumber: string) => {
        await apiClient.post("/account/me/contactpoint/otp", {
            phoneNumber: phoneNumber
        });
    },
    uploadAvatar: async (fileUri: string, imageType:string) => {
        const response = await apiClient.post("/account/me/avatar/upload-url", {
            params: {
                imageType: imageType
            }
        });
        const { uploadUrl, key } = response.data.data;

        await fetch(uploadUrl, {
            method: "PUT",
            body: {
                uri: fileUri,
                type: imageType,
                name: `avatar.${imageType.split("/")[1]}`
            },
            headers: {
                "Content-Type": imageType
            }
        });

        await apiClient.patch("/account/me/avatar", null, {
            params: {
                avatarKey: key
            }
        });

        return key;
    }
}

export default accountService;