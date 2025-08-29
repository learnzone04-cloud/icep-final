import { UserEntity } from '../../users/entity/User';
export declare enum NotificationType {
    ROOM_CREATED = "room_created",
    ROOM_ENROLLMENT = "room_enrollment",
    ROOM_STARTING = "room_starting",
    ROOM_COMPLETED = "room_completed",
    MESSAGE_RECEIVED = "message_received",
    PAYMENT_SUCCESS = "payment_success",
    PAYMENT_FAILED = "payment_failed",
    SYSTEM_ANNOUNCEMENT = "system_announcement",
    REEL_CREATED = "reel_created",
    ARTICLE_CREATED = "article_created",
    SHORT_VIDEO_CREATED = "short_video_created",
    COURSE_CREATED = "course_created"
}
export declare enum NotificationStatus {
    UNREAD = "unread",
    READ = "read"
}
export declare class Notification {
    id: number;
    userId: number;
    type: NotificationType;
    title: string;
    message: string;
    data: any;
    status: NotificationStatus;
    createdAt: Date;
    user: UserEntity;
}
