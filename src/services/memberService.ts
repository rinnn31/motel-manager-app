import { MemberService } from "../types/motelTypes";
import apiClient from "./apiClient";

const memberService: MemberService = {
    async getMembersByMotelId(motelId: string) {
        const response = await apiClient.get(`/motels/${motelId}/members`);
        return response.data.data;
    },
    async getMembersByRoomId(roomId: string) {
        const response = await apiClient.get(`/rooms/${roomId}/members`);
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
    },
    async acceptInvitation(inviteId: string) {
        await apiClient.post("/members/accept", null, {
            params: {
                inviteId: inviteId
            }
        });
    },
    async rejectInvitation(inviteId: string) {
        await apiClient.post("/members/reject", null, {
            params: {
                inviteId: inviteId
            }
        });
    },
    async inviteMember(roomId: string, phoneNumber: string) {
        await apiClient.post("/members/invite", {
            roomId,
            phoneNumber
        });
    },
    async getInvitations() {
        const response = await apiClient.get("/members/invites");
        return response.data.data;
    }
}

export default memberService;