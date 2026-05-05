import { MemberService } from "../types/motelTypes";
import apiClient from "./apiClient";

const memberService: MemberService = {
    async addMember(roomId: string, phone: string) {
        await apiClient.post("/members", {
            roomId: roomId,
            phoneNumber: phone
        });
    },
    async getMembersByMotelId(motelId: string) {
        const response = await apiClient.get(`/members/by-motel/${motelId}`);
        return response.data.data;
    },
    async getMembersByRoomId(roomId: string) {
        const response = await apiClient.get(`/members/by-room/${roomId}`);
        return response.data.data;
    },
    async removeMember(userId: string) {
        await apiClient.post("/members/remove", null, {
            params: {
                userId: userId
            }
        });
    },
    async leaveMotel() {
        await apiClient.post("/members/leave");
    }
}

export default memberService;