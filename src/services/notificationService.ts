import apiClient from "./apiClient";

const notificationService: NotificationService = {
    async getNotifications(page: number, size: number) {
        const response = await apiClient.get("/notifications", {
            params: { page, size }
        });
        return response.data.data;
    },
    async markAsRead(notificationId: string) {
        await apiClient.post(`/notifications/${notificationId}/read`);
    },
    async markAllAsRead() {
        await apiClient.post("/notifications/read");
    },
    async deleteNotification(notificationId: string) {
        await apiClient.delete(`/notifications/${notificationId}`);
    },
    async deleteAllNotifications() {
        await apiClient.delete("/notifications");
    }
}

export default notificationService;