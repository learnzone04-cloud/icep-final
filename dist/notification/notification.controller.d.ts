import { NotificationService } from './notification.service';
import { Request } from 'express';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    private getUserIdFromToken;
    getUserNotifications(req: Request, limit?: string, offset?: string): Promise<import("./entity/Notification").Notification[]>;
    getUnreadCount(req: Request): Promise<{
        count: number;
    }>;
    markAsRead(id: string, req: Request): Promise<{
        success: boolean;
    }>;
    markAllAsRead(req: Request): Promise<{
        success: boolean;
    }>;
    deleteNotification(id: string, req: Request): Promise<{
        success: boolean;
    }>;
}
