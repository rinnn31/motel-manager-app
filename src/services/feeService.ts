import apiClient from "./apiClient";
import { FeeService } from "../types/motelTypes";

const feeService: FeeService = {
    async getAllFees(motelId: string) {
        const response = await apiClient.get("/fees", { params: { motelId: motelId } });
        return response.data.data;
    },
    async addFee(motelId: string, data: { name:string, unitPrice: number; calculationType: string }) {
        await apiClient.post("/fees", data, {
            params: { motelId: motelId }
        });
    },
    async updateFee(feeId: string, data: { unitPrice?: number; calculationType?: string }) {
        await apiClient.patch(`/fees/${feeId}`, data);
    },
    async deleteFee(feeId: string) {
        await apiClient.delete(`/fees/${feeId}`);
    }
}

export default feeService;