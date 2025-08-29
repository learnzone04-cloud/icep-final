import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { CreateLessonRescheduleDto } from './dto/create-lesson-reschedule.dto';
import { CreateLessonBatchDto } from './dto/create-lesson-batch.dto';
export declare class LessonController {
    private readonly lessonService;
    constructor(lessonService: LessonService);
    bookLesson(createDto: CreateLessonDto): Promise<import("./entity/Lesson").Lesson>;
    createLessonsBatch(dto: CreateLessonBatchDto): Promise<any[]>;
    getLessonsByTeacher(req: any): Promise<{
        scheduled: import("./entity/Lesson").Lesson[];
        cancelled: import("./entity/Lesson").Lesson[];
        completed: import("./entity/Lesson").Lesson[];
    }>;
    getLessonsByStudent(req: any): Promise<{
        scheduled: import("./entity/Lesson").Lesson[];
        cancelled: import("./entity/Lesson").Lesson[];
        completed: import("./entity/Lesson").Lesson[];
    }>;
    getLessonsByChat(chatId: number): Promise<import("./entity/Lesson").Lesson[]>;
    getAvailableTimeSlots(teacherId: number, date: string): Promise<string[]>;
    requestReschedule(createRescheduleDto: CreateLessonRescheduleDto): Promise<import("./entity/LessonReschedule").LessonReschedule>;
    approveReschedule(rescheduleId: number): Promise<import("./entity/Lesson").Lesson>;
    rejectReschedule(rescheduleId: number, body: {
        reason?: string;
    }): Promise<import("./entity/LessonReschedule").LessonReschedule>;
    completeLesson(lessonId: number): Promise<import("./entity/Lesson").Lesson>;
    cancelLesson(lessonId: number): Promise<import("./entity/Lesson").Lesson>;
}
