import { RescheduleRequestedBy } from '../entity/LessonReschedule';
export declare class CreateLessonRescheduleDto {
    lessonId: number;
    requestedBy: RescheduleRequestedBy;
    oldDate: string;
    oldStartTime: string;
    newDate: string;
    newStartTime: string;
    reason?: string;
}
