import apiClient from "./apiClient";

const notificationService: NotificationService = {
    getNotifications: async (page: number, size: number) => {
        const response = await apiClient.get("/notifications", {
            params: { page, size }
        });
        return response.data.data;
    },
    markAsRead: async (notificationId: string) => {
        await apiClient.post(`/notifications/${notificationId}/read`);
    },
    markAllAsRead: async () => {
        await apiClient.post("/notifications/read");
    },
    deleteNotification: async (notificationId: string) => {
        await apiClient.delete(`/notifications/${notificationId}`);
    },
    deleteAllNotifications: async () => {
        await apiClient.delete("/notifications");
    }
}

export default notificationService;