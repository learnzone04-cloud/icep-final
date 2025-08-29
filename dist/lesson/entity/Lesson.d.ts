import { UserEntity } from '../../users/entity/User';
import { Chat } from '../../chat/entities/chat.entity';
export declare enum LessonStatus {
    SCHEDULED = "SCHEDULED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    RESCHEDULED = "RESCHEDULED"
}
export declare class Lesson {
    id: number;
    teacherId: number;
    studentId: number;
    lessonDate: Date;
    startTime: string;
    endTime: string;
    price: number;
    status: LessonStatus;
    meetLink?: string;
    notes?: string;
    chatId?: number;
    createdAt: Date;
    updatedAt: Date;
    teacher: UserEntity;
    student: UserEntity;
    chat: Chat;
}
