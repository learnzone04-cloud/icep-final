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
exports.ConversationRoomController = void 0;
const common_1 = require("@nestjs/common");
const conversation_room_service_1 = require("./conversation-room.service");
const conversation_room_participant_service_1 = require("./conversation-room-participant.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const Teacher_1 = require("../teacher/entity/Teacher");
const Student_1 = require("../student/entity/Student");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ConversationRoomController = class ConversationRoomController {
    constructor(roomService, participantService, teacherRepo, studentRepo) {
        this.roomService = roomService;
        this.participantService = participantService;
        this.teacherRepo = teacherRepo;
        this.studentRepo = studentRepo;
    }
    async createRoom(body, req) {
        const userId = req.user.id;
        const teacher = await this.teacherRepo.findOne({
            where: { userId },
            select: ['id', 'typeId', 'userId']
        });
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        return this.roomService.createRoom({ ...body, teacher });
    }
    async enrollStudent(req, body) {
        const userId = req.user.id;
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return this.participantService.enrollStudent(body.roomId, student.id, body.paymentMethodId, body.couponCode);
    }
    async getRoomsByStudentType(req) {
        const userId = req.user.id;
        const student = await this.studentRepo.findOne({
            where: { userId },
            relations: ['studentTypes', 'studentTypes.type']
        });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return this.roomService.getRoomsByStudentType(student);
    }
    async getTeacherActiveRooms(req) {
        const userId = req.user.id;
        const teacher = await this.teacherRepo.findOne({ where: { userId } });
        if (!teacher)
            throw new Error('Teacher not found');
        return this.roomService.getTeacherActiveRooms(teacher.id);
    }
    async getRoomStudents(roomId, req) {
        const userId = req.user.id;
        const teacher = await this.teacherRepo.findOne({ where: { userId } });
        if (!teacher)
            throw new Error('Teacher not found');
        return this.roomService.getRoomStudents(roomId, teacher.id);
    }
    async getStudentEnrolledRooms(req) {
        const userId = req.user.id;
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return this.roomService.getStudentEnrolledRooms(student.id);
    }
};
exports.ConversationRoomController = ConversationRoomController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ConversationRoomController.prototype, "createRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('enroll'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ConversationRoomController.prototype, "enrollStudent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('by-student-type'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConversationRoomController.prototype, "getRoomsByStudentType", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('teacher-active-rooms'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConversationRoomController.prototype, "getTeacherActiveRooms", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('room/:roomId/students'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ConversationRoomController.prototype, "getRoomStudents", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('student-enrolled-rooms'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConversationRoomController.prototype, "getStudentEnrolledRooms", null);
exports.ConversationRoomController = ConversationRoomController = __decorate([
    (0, common_1.Controller)('conversation-room'),
    __param(2, (0, typeorm_1.InjectRepository)(Teacher_1.TeacherEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(Student_1.Student)),
    __metadata("design:paramtypes", [conversation_room_service_1.ConversationRoomService,
        conversation_room_participant_service_1.ConversationRoomParticipantService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ConversationRoomController);
//# sourceMappingURL=conversation-room.controller.js.map