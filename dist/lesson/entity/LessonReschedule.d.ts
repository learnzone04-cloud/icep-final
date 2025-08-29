import { Lesson } from './Lesson';
export declare enum RescheduleRequestedBy {
    STUDENT = "STUDENT",
    TEACHER = "TEACHER"
}
export declare enum RescheduleStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class LessonReschedule {
    id: number;
    lessonId: number;
    requestedBy: RescheduleRequestedBy;
    oldDate: Date;
    oldStartTime: string;
    newDate: Date;
    newStartTime: string;
    status: RescheduleStatus;
    reason?: string;
    createdAt: Date;
    updatedAt: Date;
    lesson: Lesson;
}
