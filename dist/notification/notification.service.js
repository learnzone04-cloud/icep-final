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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Notification_1 = require("./entity/Notification");
const notification_gateway_1 = require("./notification.gateway");
let NotificationService = class NotificationService {
    constructor(notificationRepo, notificationGateway) {
        this.notificationRepo = notificationRepo;
        this.notificationGateway = notificationGateway;
    }
    async testNotification(userId) {
        console.log('🧪 testNotification called with userId:', userId);
        try {
            const notification = await this.createNotification(userId, Notification_1.NotificationType.ARTICLE_CREATED, 'Test Notification', 'This is a test notification to check if the system works.', { test: true, timestamp: new Date().toISOString() });
            console.log('✅ Test notification created successfully:', notification.id);
            return notification;
        }
        catch (error) {
            console.error('❌ Test notification failed:', error);
            throw error;
        }
    }
    async createNotification(userId, type, title, message, data) {
        console.log('📝 createNotification called with:', { userId, type, title, message });
        try {
            const notification = this.notificationRepo.create({
                userId,
                type,
                title,
                message,
                data,
                status: Notification_1.NotificationStatus.UNREAD
            });
            const savedNotification = await this.notificationRepo.save(notification);
            console.log('💾 Notification saved to database:', savedNotification.id);
            this.notificationGateway.sendNotificationToUser(userId, savedNotification);
            console.log('📡 Real-time notification sent to user:', userId);
            return savedNotification;
        }
        catch (error) {
            console.error('❌ Error in createNotification:', error);
            throw error;
        }
    }
    async sendRoomCreatedNotification(roomId, roomTitle, teacherName, studentIds) {
        for (const studentId of studentIds) {
            const student = await this.getUserByStudentId(studentId);
            if (student) {
                await this.createNotification(student, Notification_1.NotificationType.ROOM_CREATED, 'New Conversation Room Available', `A new room "${roomTitle}" by ${teacherName} is now available for enrollment.`, { roomId, roomTitle, teacherName });
            }
        }
    }
    async sendRoomEnrollmentNotification(roomId, roomTitle, studentName, teacherId) {
        const teacher = await this.getUserByTeacherId(teacherId);
        if (teacher) {
            await this.createNotification(teacher, Notification_1.NotificationType.ROOM_ENROLLMENT, 'New Student Enrollment', `${studentName} has enrolled in your room "${roomTitle}".`, { roomId, roomTitle, studentName });
        }
    }
    async sendRoomStartingNotification(roomId, roomTitle, startTime, studentIds, teacherId) {
        for (const studentId of studentIds) {
            const student = await this.getUserByStudentId(studentId);
            if (student) {
                await this.createNotification(student, Notification_1.NotificationType.ROOM_STARTING, 'Room Starting Soon', `Your conversation room "${roomTitle}" starts in 15 minutes.`, { roomId, roomTitle, startTime });
            }
        }
        const teacher = await this.getUserByTeacherId(teacherId);
        if (teacher) {
            await this.createNotification(teacher, Notification_1.NotificationType.ROOM_STARTING, 'Room Starting Soon', `Your conversation room "${roomTitle}" starts in 15 minutes.`, { roomId, roomTitle, startTime });
        }
    }
    async sendPaymentSuccessNotification(studentId, amount, roomTitle) {
        const student = await this.getUserByStudentId(studentId);
        if (student) {
            await this.createNotification(student, Notification_1.NotificationType.PAYMENT_SUCCESS, 'Payment Successful', `Payment of $${amount} for "${roomTitle}" was successful.`, { amount, roomTitle });
        }
    }
    async sendPaymentFailedNotification(studentId, amount, roomTitle) {
        const student = await this.getUserByStudentId(studentId);
        if (student) {
            await this.createNotification(student, Notification_1.NotificationType.PAYMENT_FAILED, 'Payment Failed', `Payment of $${amount} for "${roomTitle}" failed. Please try again.`, { amount, roomTitle });
        }
    }
    async sendReelCreatedNotification(teacherId, teacherName, reelId, reelDescription) {
        const followers = await this.getTeacherFollowers(teacherId);
        for (const follower of followers) {
            const student = await this.getUserByStudentId(follower.f_studentId);
            if (student) {
                await this.createNotification(student, Notification_1.NotificationType.REEL_CREATED, 'New Reel Available', `${teacherName} just posted a new reel: "${reelDescription}"`, { teacherId, teacherName, reelId, reelDescription });
            }
        }
    }
    async sendArticleCreatedNotification(teacherId, teacherName, articleId, articleContentSnippet) {
        console.log('🔔 sendArticleCreatedNotification called with:', { teacherId, teacherName, articleId });
        const followers = await this.getTeacherFollowers(teacherId);
        console.log('📱 Found followers:', followers);
        const snippet = (articleContentSnippet || '').slice(0, 40);
        if (followers.length === 0) {
            console.log('⚠️ No followers found for teacher, no notifications will be sent');
            return;
        }
        for (const follower of followers) {
            console.log('👤 Processing follower:', follower);
            const student = await this.getUserByStudentId(follower.f_studentId);
            console.log('🎓 Found student:', student);
            if (student) {
                try {
                    await this.createNotification(student, Notification_1.NotificationType.ARTICLE_CREATED, 'New Article Available', `${teacherName} just published a new article: "${snippet}..."`, { teacherId, teacherName, articleId });
                    console.log('✅ Notification created for student:', student);
                }
                catch (error) {
                    console.error('❌ Failed to create notification for student:', student, error);
                }
            }
            else {
                console.log('⚠️ Student not found for follower:', follower);
            }
        }
    }
    async sendShortVideoCreatedNotification(teacherId, teacherName, videoId, videoDescription) {
        const followers = await this.getTeacherFollowers(teacherId);
        const snippet = (videoDescription || '').slice(0, 40);
        for (const follower of followers) {
            const student = await this.getUserByStudentId(follower.f_studentId);
            if (student) {
                await this.createNotification(student, Notification_1.NotificationType.SHORT_VIDEO_CREATED, 'New Short Video Available', `${teacherName} just uploaded a new short video: "${snippet}..."`, { teacherId, teacherName, videoId });
            }
        }
    }
    async sendCourseCreatedNotification(teacherId, teacherName, courseId, courseTitle) {
        const followers = await this.getTeacherFollowers(teacherId);
        for (const follower of followers) {
            const student = await this.getUserByStudentId(follower.f_studentId);
            if (student) {
                await this.createNotification(student, Notification_1.NotificationType.COURSE_CREATED, 'New Course Available', `${teacherName} just created a new course: "${courseTitle}"`, { teacherId, teacherName, courseId });
            }
        }
    }
    async getTeacherFollowers(teacherId) {
        console.log('🔍 getTeacherFollowers called with teacherId:', teacherId);
        try {
            const followers = await this.notificationRepo.manager
                .createQueryBuilder()
                .select('f.studentId')
                .from('follower', 'f')
                .where('f.teacherId = :teacherId', { teacherId })
                .getRawMany();
            console.log('🔍 Raw followers query result:', followers);
            return followers;
        }
        catch (error) {
            console.error('❌ Error in getTeacherFollowers:', error);
            return [];
        }
    }
    async getUserByStudentId(studentId) {
        console.log('🔍 getUserByStudentId called with studentId:', studentId);
        try {
            const student = await this.notificationRepo.manager
                .createQueryBuilder()
                .select('s.userId', 'userId')
                .from('student', 's')
                .where('s.id = :studentId', { studentId })
                .getRawOne();
            console.log('🔍 getUserByStudentId query result:', student);
            if (student?.userId) {
                console.log('✅ Student found with userId:', student.userId);
                return student.userId;
            }
            else {
                console.log('❌ Student not found or missing userId:', student);
                return null;
            }
        }
        catch (error) {
            console.error('❌ Error in getUserByStudentId:', error);
            return null;
        }
    }
    async getUserByTeacherId(teacherId) {
        return this.notificationRepo.manager
            .createQueryBuilder()
            .select('t.userId')
            .from('teacher', 't')
            .where('t.id = :teacherId', { teacherId })
            .getRawOne();
    }
    async getUserNotifications(userId, limit = 20, offset = 0) {
        return this.notificationRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset
        });
    }
    async markAsRead(notificationId, userId) {
        await this.notificationRepo.update({ id: notificationId, userId }, { status: Notification_1.NotificationStatus.READ });
    }
    async markAllAsRead(userId) {
        await this.notificationRepo.update({ userId, status: Notification_1.NotificationStatus.UNREAD }, { status: Notification_1.NotificationStatus.READ });
    }
    async getUnreadCount(userId) {
        return this.notificationRepo.count({
            where: { userId, status: Notification_1.NotificationStatus.UNREAD }
        });
    }
    async deleteNotification(notificationId, userId) {
        await this.notificationRepo.delete({ id: notificationId, userId });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Notification_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_gateway_1.NotificationGateway])
], NotificationService);
//# sourceMappingURL=notification.service.js.map