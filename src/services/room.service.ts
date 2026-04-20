import { CreateRoomRequest, RoomInfo, RoomService, UpdateRoomNameRequest, UpdateRoomPriceRequest } from "../types/room.types";
import apiClient from "./apiClient";

export const roomService: RoomService = {
    getRooms: async (motelId: string) => {
        const response = await apiClient.get("/rooms", { params: { motelId: motelId } });
        return response.data.data;
    },
    getRoomById: async (roomId: string) => {
        const response = await apiClient.get(`/rooms/${roomId}`);
        return response.data.data;
    },
    getJoinedRoom: async () => {
        const response = await apiClient.get("/rooms/joined");
        return response.data.data;
    },
    createRoom: async (data: CreateRoomRequest) => {
        await apiClient.post("/rooms", data);
    },
    deleteRoom: async (roomId: string) => {
        const response = await apiClient.delete(`/rooms/${roomId}`);
        return handleApiResponse<void>(response.data);
    },
    updateRoomName: async (roomId: string, data: UpdateRoomNameRequest) => {
        const response = await apiClient.patch(`/rooms/${roomId}/name`, data);
        return handleApiResponse<void>(response.data);
    },
    updateRoomPrice: async (roomId: string, data: UpdateRoomPriceRequest) => {
        const response = await apiClient.patch(`/rooms/${roomId}/price`, data); 
        return handleApiResponse<void>(response.data);
    },

    getRoomMembers: async (roomId: string) => {
        const response = await apiClient.get(`/rooms/${roomId}/members`);
        return handleApiResponse(response.data);
    },
    addRoomMember: async (roomId: string, userId: string) => {
        const response = await apiClient.post(`/rooms/${roomId}/members`, { userId: userId });  
        return handleApiResponse<void>(response.data);
    },
    removeRoomMember: async (roomId: string, userId: string) => {
        const response = await apiClient.delete(`/rooms/${roomId}/members/${userId}`);
        return handleApiResponse<void>(response.data);
    }
}
