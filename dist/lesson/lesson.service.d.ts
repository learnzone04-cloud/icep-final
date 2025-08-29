import { Repository } from 'typeorm';
import { Lesson } from './entity/Lesson';
import { LessonReschedule } from './entity/LessonReschedule';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { CreateLessonRescheduleDto } from './dto/create-lesson-reschedule.dto';
import { CreateLessonBatchDto } from './dto/create-lesson-batch.dto';
import { GoogleCalendarService } from '../google-calendar.service';
import { AdminAuthService } from '../admin-auth/admin-auth.service';
import { UserEntity } from '../users/entity/User';
export declare class LessonService {
    private lessonRepository;
    private rescheduleRepository;
    private userRepository;
    private googleCalendarService;
    private adminAuthService;
    constructor(lessonRepository: Repository<Lesson>, rescheduleRepository: Repository<LessonReschedule>, userRepository: Repository<UserEntity>, googleCalendarService: GoogleCalendarService, adminAuthService: AdminAuthService);
    bookLesson(createDto: CreateLessonDto): Promise<Lesson>;
    getTeacherLessons(teacherId: number): Promise<Lesson[]>;
    getStudentLessons(studentId: number): Promise<Lesson[]>;
    requestReschedule(createRescheduleDto: CreateLessonRescheduleDto): Promise<LessonReschedule>;
    approveReschedule(rescheduleId: number): Promise<Lesson>;
    rejectReschedule(rescheduleId: number, reason?: string): Promise<LessonReschedule>;
    completeLesson(lessonId: number): Promise<Lesson>;
    cancelLesson(lessonId: number): Promise<Lesson>;
    getAvailableTimeSlots(teacherId: number, date: string): Promise<string[]>;
    createLessonsBatch(dto: CreateLessonBatchDto): Promise<any[]>;
    getLessonsByTeacher(teacherId: number): Promise<{
        scheduled: Lesson[];
        cancelled: Lesson[];
        completed: Lesson[];
    }>;
    getLessonsByStudent(studentId: number): Promise<{
        scheduled: Lesson[];
        cancelled: Lesson[];
        completed: Lesson[];
    }>;
    getLessonsByChat(chatId: number): Promise<Lesson[]>;
    private validateTimeSlotAvailability;
    private calculateEndTime;
    private generateTimeSlots;
    private generateGoogleMeetLink;
    private sendLessonConfirmationEmails;
    private sendRescheduleConfirmationEmails;
}
