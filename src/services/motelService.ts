import { MotelService } from "../types/motelTypes";
import apiClient from "./apiClient";

const motelService: MotelService = {
    async getAllMotels() {
        const response = await apiClient.get("/motels");
        return response.data.data;
    },
    async getMotelById(motelId: string) {
        const response = await apiClient.get(`/motels/${motelId}`);
        return response.data.data;
    },
    async getJoinedMotel() {
        const response = await apiClient.get("/motels/joined");
        return response.data.data;
    },
    async createMotel (data: { displayName: string; }) {
        await apiClient.post("/motels", data);
    },
    async deleteMotel (motelId: string) {
        await apiClient.delete(`/motels/${motelId}`);
    },
    async updateMotelName(motelId: string, data: { newName: string; }) {
        await apiClient.patch(`/motels/${motelId}/name`, data);
    },
    async getMotelOwner(motelId: string){
        const response = await apiClient.get(`/motels/${motelId}/owner`);
        return response.data.data;
    }
}

export default motelService;