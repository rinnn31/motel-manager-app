import { RoomService } from "../types/motelTypes";
import apiClient from "./apiClient";

const roomService: RoomService = {
    async getRooms(motelId: string) {
        const response = await apiClient.get("/rooms", { params: { motelId: motelId } });
        return response.data.data;
    },
    async getRoomById(roomId: string) {
        const response = await apiClient.get(`/rooms/${roomId}`);
        return response.data.data;
    },
    async getJoinedRoom() {
        const response = await apiClient.get("/rooms/joined");
        return response.data.data;
    },
    async createRoom(data: { roomNumber: string; roomPrice: number }) {
        await apiClient.post("/rooms", data);
    },
    async deleteRoom(roomId: string) {
        await apiClient.delete(`/rooms/${roomId}`);

    },
    async updateRoom(roomId: string, data: { roomNumber?: string; roomPrice?: number }) {
        await apiClient.patch(`/rooms/${roomId}`, data);
    }
}

export default roomService;
