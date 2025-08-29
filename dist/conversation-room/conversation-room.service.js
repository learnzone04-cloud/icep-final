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
exports.ConversationRoomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ConversationRoom_1 = require("./entity/ConversationRoom");
const ConversationRoomParticipant_1 = require("./entity/ConversationRoomParticipant");
const placement_test_entity_1 = require("../placement-test/placement-test.entity");
const notification_service_1 = require("../notification/notification.service");
let ConversationRoomService = class ConversationRoomService {
    constructor(roomRepo, participantRepo, notificationService) {
        this.roomRepo = roomRepo;
        this.participantRepo = participantRepo;
        this.notificationService = notificationService;
    }
    async createRoom(data) {
        if (!data.level || !Array.isArray(data.level) || data.level.length === 0) {
            throw new common_1.BadRequestException('At least one level is required');
        }
        for (const lvl of data.level) {
            if (!Object.values(placement_test_entity_1.PlacementLevel).includes(lvl)) {
                throw new common_1.BadRequestException(`Invalid level: ${lvl}`);
            }
        }
        const now = new Date();
        if (!data.startTime || new Date(data.startTime) <= now) {
            throw new common_1.BadRequestException('Start time must be in the future');
        }
        if (!data.endTime || new Date(data.endTime) <= new Date(data.startTime)) {
            throw new common_1.BadRequestException('End time must be after start time');
        }
        if (data.teacher && data.teacher.typeId) {
            data.typeId = data.teacher.typeId;
        }
        else if (data.teacher && data.teacher.id) {
            const teacher = await this.roomRepo.manager
                .createQueryBuilder()
                .select('teacher.typeId')
                .from('teachers', 'teacher')
                .where('teacher.id = :teacherId', { teacherId: data.teacher.id })
                .getRawOne();
            if (teacher) {
                data.typeId = teacher.typeId;
            }
            else {
                throw new common_1.BadRequestException('Teacher type not found');
            }
        }
        else {
            throw new common_1.BadRequestException('Teacher is required');
        }
        if (data.teacher && data.teacher.id) {
            const overlap = await this.roomRepo.createQueryBuilder('room')
                .leftJoinAndSelect('room.teacher', 'teacher')
                .where('teacher.id = :teacherId', { teacherId: data.teacher.id })
                .andWhere('room.startTime < :newEnd', { newEnd: data.endTime })
                .andWhere(':newStart < room.endTime', { newStart: data.startTime })
                .getOne();
            if (overlap) {
                throw new common_1.BadRequestException('Teacher already has a room during this time');
            }
        }
        const room = this.roomRepo.create(data);
        const savedRoom = await this.roomRepo.save(room);
        try {
            const teacherName = `${data.teacher.user?.fName || 'Teacher'} ${data.teacher.user?.lName || ''}`;
            const followers = await this.roomRepo.manager
                .createQueryBuilder()
                .select('f.studentId')
                .from('follower', 'f')
                .where('f.teacherId = :teacherId', { teacherId: data.teacher.id })
                .getRawMany();
            if (followers.length > 0) {
                const studentIds = followers.map(f => f.studentId);
                await this.notificationService.sendRoomCreatedNotification(savedRoom.id, savedRoom.title, teacherName, studentIds);
            }
        }
        catch (error) {
            console.error('Failed to send room creation notifications:', error);
        }
        return savedRoom;
    }
    async getRoomsByStudentType(student) {
        if (!student.studentTypes || student.studentTypes.length === 0) {
            return [];
        }
        const studentTypeIds = student.studentTypes.map(st => st.typeId);
        return this.roomRepo.createQueryBuilder('room')
            .leftJoinAndSelect('room.teacher', 'teacher')
            .leftJoinAndSelect('room.type', 'type')
            .where('room.typeId IN (:...typeIds)', { typeIds: studentTypeIds })
            .andWhere('room.status IN (:...statuses)', {
            statuses: ['scheduled', 'ongoing']
        })
            .andWhere('room.startTime > :now', { now: new Date() })
            .orderBy('room.startTime', 'ASC')
            .getMany();
    }
    async getTeacherActiveRooms(teacherId) {
        return this.roomRepo.createQueryBuilder('room')
            .leftJoinAndSelect('room.type', 'type')
            .leftJoinAndSelect('room.participants', 'participants')
            .leftJoinAndSelect('participants.student', 'student')
            .leftJoinAndSelect('student.user', 'user')
            .leftJoinAndSelect('room.teacher', 'teacher')
            .where('teacher.id = :teacherId', { teacherId })
            .andWhere('room.status IN (:...statuses)', {
            statuses: ['scheduled', 'ongoing']
        })
            .orderBy('room.startTime', 'ASC')
            .getMany();
    }
    async getRoomStudents(roomId, teacherId) {
        const room = await this.roomRepo.findOne({
            where: { id: roomId },
            relations: ['participants', 'participants.student', 'participants.student.user', 'teacher']
        });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        if (room.teacher.id !== teacherId) {
            throw new common_1.ForbiddenException('You do not have access to this room');
        }
        return room.participants.map(participant => ({
            id: participant.student.id,
            userId: participant.student.userId,
            firstName: participant.student.user.fName,
            lastName: participant.student.user.lName,
            email: participant.student.user.email,
            phoneNumber: participant.student.user.phoneNumber,
            paid: participant.paid,
            joinedAt: participant.joinedAt,
            work: participant.student.work
        }));
    }
    async getStudentEnrolledRooms(studentId) {
        return this.roomRepo.createQueryBuilder('room')
            .leftJoinAndSelect('room.teacher', 'teacher')
            .leftJoinAndSelect('room.type', 'type')
            .leftJoinAndSelect('room.participants', 'participants')
            .where('participants.studentId = :studentId', { studentId })
            .orderBy('room.startTime', 'ASC')
            .getMany();
    }
};
exports.ConversationRoomService = ConversationRoomService;
exports.ConversationRoomService = ConversationRoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ConversationRoom_1.ConversationRoom)),
    __param(1, (0, typeorm_1.InjectRepository)(ConversationRoomParticipant_1.ConversationRoomParticipant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], ConversationRoomService);
//# sourceMappingURL=conversation-room.service.js.map