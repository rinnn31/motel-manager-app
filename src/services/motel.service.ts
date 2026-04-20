import { CreateChargeRequest, CreateMotelRequest, MotelService, UpdateChargeRequest, UpdateMotelNameRequest } from "../types/motel.types";
import apiClient from "./api/apiClient";

export const motelService: MotelService = {
    getAllMotels: async () => {
        const response = await apiClient.get("/motels");
        return response.data;
    },
    getJoinedMotel: async () => {
        const response = await apiClient.get("/motels/joined");
        return response.data;
    },
    createMotel: async (data: CreateMotelRequest) => {
        await apiClient.post("/motels", data);
    },
    deleteMotel: async (motelId: string) => {
        await apiClient.delete(`/motels/${motelId}`);
    },
    updateMotelName: async (motelId: string, data: UpdateMotelNameRequest) => {
        await apiClient.patch(`/motels/${motelId}/name`, data);
    },

    getAllCharges: async () => {
        const response = await apiClient.get("/charges");
        return response.data;
    },
    addCharge: async (data: CreateChargeRequest) => {
        await apiClient.post("/charges", data);
    },
    deleteCharge: async (chargeId: string) => {
        await apiClient.delete(`/charges/${chargeId}`);
    },
    updateCharge: async (chargeId: string, data: UpdateChargeRequest) => {
        await apiClient.patch(`/charges/${chargeId}`, data);
    }
}