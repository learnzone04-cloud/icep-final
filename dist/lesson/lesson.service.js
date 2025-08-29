"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Lesson_1 = require("./entity/Lesson");
const LessonReschedule_1 = require("./entity/LessonReschedule");
const google_calendar_service_1 = require("../google-calendar.service");
const admin_auth_service_1 = require("../admin-auth/admin-auth.service");
const User_1 = require("../users/entity/User");
let LessonService = class LessonService {
    constructor(lessonRepository, rescheduleRepository, userRepository, googleCalendarService, adminAuthService) {
        this.lessonRepository = lessonRepository;
        this.rescheduleRepository = rescheduleRepository;
        this.userRepository = userRepository;
        this.googleCalendarService = googleCalendarService;
        this.adminAuthService = adminAuthService;
    }
    async bookLesson(createDto) {
        await this.validateTimeSlotAvailability(createDto);
        const endTime = this.calculateEndTime(createDto.startTime);
        const meetLink = await this.generateGoogleMeetLink(createDto);
        const lesson = this.lessonRepository.create({
            ...createDto,
            endTime,
            meetLink,
            status: Lesson_1.LessonStatus.SCHEDULED,
        });
        const savedLesson = await this.lessonRepository.save(lesson);
        await this.sendLessonConfirmationEmails(savedLesson);
        return savedLesson;
    }
    async getTeacherLessons(teacherId) {
        return await this.lessonRepository.find({
            where: { teacherId },
            relations: ['student', 'reschedules'],
            order: { lessonDate: 'ASC', startTime: 'ASC' },
        });
    }
    async getStudentLessons(studentId) {
        return await this.lessonRepository.find({
            where: { studentId },
            relations: ['teacher', 'reschedules'],
            order: { lessonDate: 'ASC', startTime: 'ASC' },
        });
    }
    async requestReschedule(createRescheduleDto) {
        const lesson = await this.lessonRepository.findOne({
            where: { id: createRescheduleDto.lessonId }
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        await this.validateTimeSlotAvailability({
            teacherId: lesson.teacherId,
            studentId: lesson.studentId,
            lessonDate: createRescheduleDto.newDate,
            startTime: createRescheduleDto.newStartTime,
        });
        const reschedule = this.rescheduleRepository.create({
            ...createRescheduleDto,
            status: LessonReschedule_1.RescheduleStatus.PENDING,
        });
        return await this.rescheduleRepository.save(reschedule);
    }
    async approveReschedule(rescheduleId) {
        const reschedule = await this.rescheduleRepository.findOne({
            where: { id: rescheduleId },
            relations: ['lesson'],
        });
        if (!reschedule) {
            throw new common_1.NotFoundException('Reschedule request not found');
        }
        if (reschedule.status !== LessonReschedule_1.RescheduleStatus.PENDING) {
            throw new common_1.BadRequestException('Reschedule request is not pending');
        }
        const lesson = reschedule.lesson;
        lesson.lessonDate = new Date(reschedule.newDate);
        lesson.startTime = reschedule.newStartTime;
        lesson.endTime = this.calculateEndTime(reschedule.newStartTime);
        lesson.status = Lesson_1.LessonStatus.RESCHEDULED;
        reschedule.status = LessonReschedule_1.RescheduleStatus.APPROVED;
        await this.rescheduleRepository.save(reschedule);
        const updatedLesson = await this.lessonRepository.save(lesson);
        await this.sendRescheduleConfirmationEmails(updatedLesson, reschedule);
        return updatedLesson;
    }
    async rejectReschedule(rescheduleId, reason) {
        const reschedule = await this.rescheduleRepository.findOne({
            where: { id: rescheduleId }
        });
        if (!reschedule) {
            throw new common_1.NotFoundException('Reschedule request not found');
        }
        reschedule.status = LessonReschedule_1.RescheduleStatus.REJECTED;
        if (reason) {
            reschedule.reason = reason;
        }
        return await this.rescheduleRepository.save(reschedule);
    }
    async completeLesson(lessonId) {
        const lesson = await this.lessonRepository.findOne({
            where: { id: lessonId }
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        lesson.status = Lesson_1.LessonStatus.COMPLETED;
        return await this.lessonRepository.save(lesson);
    }
    async cancelLesson(lessonId) {
        const lesson = await this.lessonRepository.findOne({
            where: { id: lessonId }
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        lesson.status = Lesson_1.LessonStatus.CANCELLED;
        return await this.lessonRepository.save(lesson);
    }
    async getAvailableTimeSlots(teacherId, date) {
        const lessonDate = new Date(date);
        const dayOfWeek = lessonDate.getDay() === 0 ? 7 : lessonDate.getDay();
        const timeSlots = this.generateTimeSlots('09:00', '18:00');
        const bookedLessons = await this.lessonRepository.find({
            where: {
                teacherId,
                lessonDate: new Date(date),
                status: Lesson_1.LessonStatus.SCHEDULED
            }
        });
        console.log('Booked lessons for date:', date, bookedLessons);
        console.log('Available slots before filtering:', timeSlots);
        const bookedTimes = bookedLessons.map(lesson => lesson.startTime);
        const availableSlots = timeSlots.filter(slot => !bookedTimes.includes(slot));
        console.log('Booked times:', bookedTimes);
        console.log('Available slots after filtering:', availableSlots);
        return availableSlots;
    }
    async createLessonsBatch(dto) {
        const { teacherId, studentId, chatId, lessons, price } = dto;
        const createdLessons = [];
        const teacher = await this.userRepository.findOne({ where: { id: teacherId } });
        const student = await this.userRepository.findOne({ where: { id: studentId } });
        if (!teacher || !student) {
            throw new common_1.NotFoundException('Teacher or student not found');
        }
        const adminEmail = this.adminAuthService['ALLOWED_ADMIN_EMAILS'][0];
        const adminTokens = this.adminAuthService.getYouTubeTokens(adminEmail);
        if (adminTokens) {
            this.googleCalendarService.setCredentials({
                access_token: adminTokens.accessToken,
                refresh_token: adminTokens.refreshToken,
                scope: adminTokens.scope || 'https://www.googleapis.com/auth/calendar'
            });
        }
        for (const l of lessons) {
            const existingLessons = await this.lessonRepository.find({
                where: {
                    teacherId,
                    lessonDate: new Date(l.lessonDate),
                    status: (0, typeorm_2.Not)(Lesson_1.LessonStatus.CANCELLED),
                },
            });
            for (const existing of existingLessons) {
                if ((l.startTime < existing.endTime) &&
                    (existing.startTime < l.endTime)) {
                    throw new common_1.BadRequestException(`Lesson overlaps with existing lesson from ${existing.startTime} to ${existing.endTime} on ${l.lessonDate}`);
                }
            }
            let meetLink = '';
            try {
                const summary = `Lesson-${student.fName} ${student.lName}-${teacher.fName} ${teacher.lName}`;
                meetLink = await this.googleCalendarService.createMeetEvent({
                    summary,
                    description: 'Private lesson between teacher and student',
                    start: `${l.lessonDate}T${l.startTime}:00`,
                    end: `${l.lessonDate}T${l.endTime}:00`,
                    attendees: [teacher.email, student.email],
                    timeZone: 'Asia/Damascus',
                });
            }
            catch (e) {
                meetLink = '';
            }
            const lesson = this.lessonRepository.create({
                teacherId,
                studentId,
                chatId,
                lessonDate: new Date(l.lessonDate),
                startTime: l.startTime,
                endTime: l.endTime,
                price,
                status: Lesson_1.LessonStatus.SCHEDULED,
                meetLink,
            });
            createdLessons.push(await this.lessonRepository.save(lesson));
        }
        return createdLessons;
    }
    async getLessonsByTeacher(teacherId) {
        const scheduled = await this.lessonRepository.find({ where: { teacherId, status: Lesson_1.LessonStatus.SCHEDULED }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
        const cancelled = await this.lessonRepository.find({ where: { teacherId, status: Lesson_1.LessonStatus.CANCELLED }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
        const completed = await this.lessonRepository.find({ where: { teacherId, status: Lesson_1.LessonStatus.COMPLETED }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
        return { scheduled, cancelled, completed };
    }
    async getLessonsByStudent(studentId) {
        const scheduled = await this.lessonRepository.find({ where: { studentId, status: Lesson_1.LessonStatus.SCHEDULED }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
        const cancelled = await this.lessonRepository.find({ where: { studentId, status: Lesson_1.LessonStatus.CANCELLED }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
        const completed = await this.lessonRepository.find({ where: { studentId, status: Lesson_1.LessonStatus.COMPLETED }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
        return { scheduled, cancelled, completed };
    }
    async getLessonsByChat(chatId) {
        return this.lessonRepository.find({ where: { chatId }, order: { lessonDate: 'ASC', startTime: 'ASC' } });
    }
    async validateTimeSlotAvailability(createDto) {
        const availableSlots = await this.getAvailableTimeSlots(createDto.teacherId, createDto.lessonDate);
        if (!availableSlots.includes(createDto.startTime)) {
            throw new common_1.BadRequestException('Selected time slot is not available');
        }
    }
    calculateEndTime(startTime) {
        const [hours, minutes] = startTime.split(':').map(Number);
        const endHours = hours + 1;
        return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    generateTimeSlots(startTime, endTime) {
        const slots = [];
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        let currentHour = startHour;
        let currentMinute = startMinute;
        while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
            const slotTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            slots.push(slotTime);
            currentMinute += 75;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute = currentMinute % 60;
            }
        }
        return slots;
    }
    async generateGoogleMeetLink(createDto) {
        return `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`;
    }
    async sendLessonConfirmationEmails(lesson) {
        console.log(`Sending confirmation emails for lesson ${lesson.id}`);
    }
    async sendRescheduleConfirmationEmails(lesson, reschedule) {
        console.log(`Sending reschedule confirmation emails for lesson ${lesson.id}`);
    }
};
exports.LessonService = LessonService;
exports.LessonService = LessonService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Lesson_1.Lesson)),
    __param(1, (0, typeorm_1.InjectRepository)(LessonReschedule_1.LessonReschedule)),
    __param(2, (0, typeorm_1.InjectRepository)(User_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        google_calendar_service_1.GoogleCalendarService,
        admin_auth_service_1.AdminAuthService])
], LessonService);
//# sourceMappingURL=lesson.service.js.map