import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entity/Notification';
import { NotificationGateway } from './notification.gateway';
export declare class NotificationService {
    private readonly notificationRepo;
    private readonly notificationGateway;
    constructor(notificationRepo: Repository<Notification>, notificationGateway: NotificationGateway);
    createNotification(userId: number, type: NotificationType, title: string, message: string, data?: any): Promise<Notification>;
    sendRoomCreatedNotification(roomId: number, roomTitle: string, teacherName: string, studentIds: number[]): Promise<void>;
    sendRoomEnrollmentNotification(roomId: number, roomTitle: string, studentName: string, teacherId: number): Promise<void>;
    sendRoomStartingNotification(roomId: number, roomTitle: string, startTime: Date, userIds: number[]): Promise<void>;
    sendRoomCancelledNotification(roomId: number, roomTitle: string, userIds: number[]): Promise<void>;
    sendPaymentSuccessNotification(userId: number, amount: number, roomTitle: string): Promise<void>;
    sendPaymentFailedNotification(userId: number, amount: number, roomTitle: string): Promise<void>;
    sendReelCreatedNotification(teacherId: number, teacherName: string, reelId: number, reelDescription: string): Promise<void>;
    sendArticleCreatedNotification(teacherId: number, teacherName: string, articleId: number, articleContentSnippet: string): Promise<void>;
    sendShortVideoCreatedNotification(teacherId: number, teacherName: string, videoId: number, videoDescription: string): Promise<void>;
    sendCourseCreatedNotification(teacherId: number, teacherName: string, courseId: number, courseTitle: string): Promise<void>;
    private getTeacherFollowers;
    getUserNotifications(userId: number, limit?: number, offset?: number): Promise<Notification[]>;
    markAsRead(notificationId: number, userId: number): Promise<void>;
    markAllAsRead(userId: number): Promise<void>;
    getUnreadCount(userId: number): Promise<number>;
    deleteNotification(notificationId: number, userId: number): Promise<void>;
}
