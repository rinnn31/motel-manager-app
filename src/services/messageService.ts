import apiClient from "./apiClient";
import { MessageService } from "../types/motelTypes";

const messageService: MessageService = {
    async getSentMessagesForMotel(motelId: string, from: number, page: number, size: number) {
        const response = await apiClient.get("/messages", {
            params: {
                objectId: motelId,
                objectType: "motel",
                box: "sent",
                from: from,
                page: page,
                size: size
            }
        });
        return response.data.data;
    },
    async getReceivedMessagesForMotel(motelId: string, from: number, page: number, size: number) {
        const response = await apiClient.get("/messages", {
            params: {
                objectId: motelId,
                objectType: "motel",
                box: "received",
                from: from,
                page: page,
                size: size
            }
        });
        return response.data.data;
    },
    async getSentMessagesForRoom(roomId: string, from: number, page: number, size: number) {
        const response = await apiClient.get("/messages", {
            params: {
                objectId: roomId,
                objectType: "room",
                box: "sent",
                from: from,
                page: page,
                size: size
            }
        });
        return response.data.data;
    },
    async getReceivedMessagesForRoom(roomId: string, from: number, page: number, size: number) {
        const response = await apiClient.get("/messages", {
            params: {
                objectId: roomId,
                objectType: "room",
                box: "received",
                from: from,
                page: page,
                size: size
            }
        });
        return response.data.data;
    },
    async sendMessageToMotel(
        motelId: string,
        roomId: string,
        data: {
            title: string;
            content: string;
            attachments?: { path: string; type: string; }[];
        }
    ) {
        await apiClient.post("/messages", data, {
            params: {
                sendObjectType: "room",
            }
        });
    },
    async sendMessageToRoom(
        motelId: string,
        roomIds: string[],
        data: {
            title: string;
            content: string;
            attachments?: { path: string; type: string; }[];
        }
    ) {
        await apiClient.post("/messages", {
            ...data,
            targetRoomIds: roomIds
        }, {
            params: {
                sendObjectType: "motel",
            }
        });
    },
}

export default messageService;