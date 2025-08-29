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
exports.LiveKitService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const livekit_server_sdk_1 = require("livekit-server-sdk");
const typeorm_1 = require("@nestjs/typeorm");
const ConversationRoom_1 = require("./entity/ConversationRoom");
const Teacher_1 = require("../teacher/entity/Teacher");
const Student_1 = require("../student/entity/Student");
const ConversationRoomParticipant_1 = require("./entity/ConversationRoomParticipant");
const typeorm_2 = require("typeorm");
const notification_service_1 = require("../notification/notification.service");
let LiveKitService = class LiveKitService {
    constructor(roomRepo, teacherRepo, studentRepo, participantRepo, notificationService, configService) {
        this.roomRepo = roomRepo;
        this.teacherRepo = teacherRepo;
        this.studentRepo = studentRepo;
        this.participantRepo = participantRepo;
        this.notificationService = notificationService;
        this.configService = configService;
        this.apiKey = this.configService.get('LIVEKIT_API_KEY');
        this.apiSecret = this.configService.get('LIVEKIT_API_SECRET');
        this.wsUrl = this.configService.get('LIVEKIT_WS_URL') || 'wss://icep-oha22jm9.livekit.cloud';
    }
    async buildTokenWithAccessCheck(roomName, user) {
        const userId = user.id;
        const userRole = (user.role || '').toLowerCase();
        const userName = (user.name || '').trim().replace(/\s+/g, ' ');
        let identity = '';
        let allowed = false;
        console.log('Building token with access check:', {
            roomName,
            userId,
            userRole,
            userName,
            originalRole: user.role
        });
        const roomId = parseInt(roomName.replace('conversation-room-', ''));
        const room = await this.roomRepo.findOne({ where: { id: roomId }, relations: ['teacher'] });
        if (!room)
            throw new common_1.BadRequestException('Room not found');
        console.log('Found room:', {
            roomId: room.id,
            teacherId: room.teacher?.id,
            teacherUserId: room.teacher?.userId
        });
        const teacher = await this.teacherRepo.findOne({ where: { userId } });
        console.log('Found teacher:', teacher ? { id: teacher.id, userId: teacher.userId } : null);
        if (userRole === 'teacher' && teacher && teacher.id === room.teacher.id) {
            if (!room.teacherJoinedAt) {
                room.teacherJoinedAt = new Date();
                room.status = ConversationRoom_1.ConversationRoomStatus.ONGOING;
                await this.roomRepo.save(room);
                try {
                    const enrolledStudents = await this.participantRepo.find({
                        where: { room: { id: roomId } },
                        relations: ['student', 'student.user']
                    });
                    if (enrolledStudents.length > 0) {
                        const studentIds = enrolledStudents.map(p => p.student.id);
                        await this.notificationService.sendRoomStartingNotification(roomId, room.title, room.startTime, studentIds, room.teacher.id);
                    }
                }
                catch (error) {
                    console.error('Failed to send room starting notifications:', error);
                }
            }
            allowed = true;
            identity = `id:${teacher.id}|name:${userName}|role:teacher`;
        }
        else if (userRole === 'student') {
            if (!room.teacherJoinedAt) {
                throw new common_1.BadRequestException('Teacher must join the room first');
            }
            const student = await this.studentRepo.findOne({ where: { userId } });
            if (!student)
                throw new common_1.BadRequestException('Student not found');
            const participant = await this.participantRepo.findOne({ where: { room: { id: roomId }, student: { id: student.id } } });
            if (!participant)
                throw new common_1.BadRequestException('Not enrolled in this room');
            if (!participant.joinedAt) {
                participant.joinedAt = new Date();
                await this.participantRepo.save(participant);
                try {
                    const studentUser = await this.studentRepo.findOne({
                        where: { id: student.id },
                        relations: ['user']
                    });
                    if (studentUser && studentUser.user) {
                        const studentName = `${studentUser.user.fName} ${studentUser.user.lName}`;
                        await this.notificationService.sendRoomEnrollmentNotification(roomId, room.title, studentName, room.teacher.userId);
                    }
                }
                catch (error) {
                    console.error('Failed to send student joined notification:', error);
                }
            }
            identity = `id:${student.id}|name:${userName}|role:student`;
            allowed = true;
        }
        console.log('Access check result:', { allowed, identity, userRole, teacherFound: !!teacher });
        if (!allowed)
            throw new common_1.BadRequestException('Not allowed to join this room');
        let ttl = 3600;
        if (room.startTime && room.endTime) {
            const roomDurationMs = room.endTime.getTime() - room.startTime.getTime();
            const roomDurationSeconds = Math.floor(roomDurationMs / 1000);
            const extraSeconds = 300;
            ttl = Math.max(roomDurationSeconds + extraSeconds, 3600);
        }
        console.log(`Generating token for room: ${roomName}, identity: ${identity}, TTL: ${ttl}`);
        const token = await this.generateToken(roomName, identity, ttl);
        return { token, wsUrl: this.wsUrl, identity };
    }
    async generateToken(roomName, identity, ttl = 3600) {
        try {
            console.log(`Generating LiveKit token with params:`, {
                roomName,
                identity,
                ttl,
                apiKey: this.apiKey.substring(0, 8) + '...'
            });
            const at = new livekit_server_sdk_1.AccessToken(this.apiKey, this.apiSecret, {
                identity,
                ttl,
            });
            at.addGrant({
                room: roomName,
                roomJoin: true,
                canPublish: true,
                canSubscribe: true,
                canPublishData: true,
            });
            const token = await at.toJwt();
            console.log(`Token generated successfully for identity: ${identity}`);
            return token;
        }
        catch (error) {
            console.error('Error generating LiveKit token:', error);
            throw new common_1.BadRequestException('Failed to generate access token');
        }
    }
    async markRoomAsCompleted(roomId) {
        const room = await this.roomRepo.findOne({ where: { id: roomId } });
        if (!room)
            throw new common_1.BadRequestException('Room not found');
        room.status = ConversationRoom_1.ConversationRoomStatus.COMPLETED;
        await this.roomRepo.save(room);
        try {
            const participants = await this.participantRepo.find({
                where: { room: { id: roomId } },
                relations: ['student', 'student.user']
            });
            const userIds = [
                room.teacher.userId,
                ...participants.map(p => p.student.userId)
            ];
            for (const userId of userIds) {
                await this.notificationService.createNotification(userId, 'room_completed', 'Room Completed', `The conversation room "${room.title}" has been completed.`, { roomId, roomTitle: room.title });
            }
        }
        catch (error) {
            console.error('Failed to send room completion notifications:', error);
        }
    }
    async cancelRoom(roomId) {
        const room = await this.roomRepo.findOne({ where: { id: roomId } });
        if (!room)
            throw new common_1.BadRequestException('Room not found');
        room.status = ConversationRoom_1.ConversationRoomStatus.CANCELLED;
        await this.roomRepo.save(room);
        console.log(`Room ${roomId} has been cancelled without sending notifications`);
    }
};
exports.LiveKitService = LiveKitService;
exports.LiveKitService = LiveKitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ConversationRoom_1.ConversationRoom)),
    __param(1, (0, typeorm_1.InjectRepository)(Teacher_1.TeacherEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(Student_1.Student)),
    __param(3, (0, typeorm_1.InjectRepository)(ConversationRoomParticipant_1.ConversationRoomParticipant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService,
        config_1.ConfigService])
], LiveKitService);
//# sourceMappingURL=livekit.service.js.map