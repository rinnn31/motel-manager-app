interface Notification {
    id: string,
    title: string,
    referenceId?: string, // ID tham chiếu đến đối tượng liên quan (ví dụ: hóa đơn, sự kiện, v.v.)
    type: string, // Loại thông báo (ví dụ: "payment", "system", "schedule", "warning")
    createdAt: number, // Thời gian tạo thông báo
    isRead: boolean, // Trạng thái đã đọc hay chưa
}

interface NotificationService {
    getNotifications: (page: number, size: number) => Promise<Notification[]>,
    markAsRead: (notificationId: string) => Promise<void>,
    markAllAsRead: () => Promise<void>,
    deleteNotification: (notificationId: string) => Promise<void>,
    deleteAllNotifications: () => Promise<void>,
}