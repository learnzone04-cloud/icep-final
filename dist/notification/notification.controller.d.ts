import { NotificationService } from './notification.service';
import { Request } from 'express';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    testNotification(req: Request): Promise<{
        success: boolean;
        message: string;
        notificationId: number;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        notificationId?: undefined;
    }>;
    private getUserIdFromToken;
    getUserNotifications(req: Request, limit?: string, offset?: string): Promise<import("./entity/Notification").Notification[]>;
    getUnreadCount(req: Request): Promise<{
        count: number;
    }>;
    markAllAsRead(req: Request): Promise<{
        success: boolean;
    }>;
    markAsRead(id: string, req: Request): Promise<{
        success: boolean;
    }>;
    deleteNotification(id: string, req: Request): Promise<{
        success: boolean;
    }>;
}
