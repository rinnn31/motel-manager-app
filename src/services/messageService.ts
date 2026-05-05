import apiClient from "./apiClient";
import { MessageService } from "../types/motelTypes";

const messageService: MessageService = {
    async getMessageById(messageId: string) {
        const response = await apiClient.get(`/messages/${messageId}`);
        return response.data.data;
    },
    async getSentMessagesForMotel(motelId: string, from: string, to: string, page: number, size: number) {
        const response = await apiClient.get("/messages", {
            params: {
                objectId: motelId,
                objectType: "motel",
                box: "sent",
                from: from,
                to: to,
                page: page,
                size: size
            }
        });
        return response.data.data;
    },
    async getReceivedMessagesForMotel(motelId: string, from: string, to: string, page: number, size: number) {
        const response = await apiClient.get("/messages", {
            params: {
                objectId: motelId,
                objectType: "motel",
                box: "received",
                from: from,
                to: to,
                page: page,
                size: size
            }
        });
        return response.data.data;
    },
    async getSentMessagesForRoom(roomId: string, from: string, to: string, page: number, size: number) {
        const response = await apiClient.get("/messages", {
            params: {
                objectId: roomId,
                objectType: "room",
                box: "sent",
                from: from,
                to: to,
                page: page,
                size: size
            }
        });
        return response.data.data;
    },
    async getReceivedMessagesForRoom(roomId: string, from: string, to: string, page: number, size: number) {
        const response = await apiClient.get("/messages", {
            params: {
                objectId: roomId,
                objectType: "room",
                box: "received",
                from: from,
                to: to,
                page: page,
                size: size
            }
        });
        return response.data.data;
    },
    async sendMessageToMotel(
        data: {
            title: string;
            content: string;
            attachments?: { path: string; type: string; }[];
        }
    ) {
        const res = await apiClient.post("/messages", {
            title: data.title,
            content: data.content,
            attachmentContentTypes: data.attachments?.map(att => att.type) || [],

        }, {
            params: {
                sendObjectType: "room",
            }
        });

        if (res.data.data) {
            for (let i = 0; i < data.attachments!.length; i++) {
                const attachment = data.attachments![i];
                const uploadUrl = res.data.data[i].uploadUrl;

                await fetch(uploadUrl, {
                    method: "PUT",
                    body: {
                        uri: attachment.path,
                        type: attachment.type,
                        name: `attachment.${attachment.type.split("/")[1]}`
                    },
                    headers: {
                        "Content-Type": attachment.type
                    }
                });
            }
        }
    },
    async sendMessageToRoom(
        roomIds: string[],
        data: {
            title: string;
            content: string;
            attachments?: { path: string; type: string; }[];
        }
    ) {
        const res = await apiClient.post("/messages", {
            title: data.title,
            content: data.content,
            attachmentContentTypes: data.attachments?.map(att => att.type) || [],
            targetRoomIds: roomIds
        }, {
            params: {
                sendObjectType: "motel",
            }
        });

        if (res.data.data) {
            for (let i = 0; i < data.attachments!.length; i++) {
                const attachment = data.attachments![i];
                const uploadUrl = res.data.data[i].uploadUrl;

                await fetch(uploadUrl, {
                    method: "PUT",
                    body: {
                        uri: attachment.path,
                        type: attachment.type,
                        name: `attachment.${attachment.type.split("/")[1]}`
                    },
                    headers: {
                        "Content-Type": attachment.type
                    }
                });
            }
        }
    },
}

export default messageService;