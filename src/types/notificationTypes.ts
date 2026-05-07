interface Notification {
    id: string,
    title: string,
    content?: string,
    extraData?: any,
    type: 'MESSAGE' | 'MOTEL_INFO_CHANGED' | 'MOTEL_FEE_CHANGED' | 'MOTEL_NAME_CHANGED' | 'ROOM_INFO_CHANGED' | 'ROOM_MEMBER_CHANGED' | 'INVOICE_UPDATED' | 'INVOICE_DELETED' | 'INVITATION',
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