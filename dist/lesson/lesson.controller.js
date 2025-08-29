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
exports.LessonController = void 0;
const common_1 = require("@nestjs/common");
const lesson_service_1 = require("./lesson.service");
const create_lesson_dto_1 = require("./dto/create-lesson.dto");
const create_lesson_reschedule_dto_1 = require("./dto/create-lesson-reschedule.dto");
const create_lesson_batch_dto_1 = require("./dto/create-lesson-batch.dto");
const passport_1 = require("@nestjs/passport");
let LessonController = class LessonController {
    constructor(lessonService) {
        this.lessonService = lessonService;
    }
    async bookLesson(createDto) {
        return await this.lessonService.bookLesson(createDto);
    }
    async createLessonsBatch(dto) {
        return this.lessonService.createLessonsBatch(dto);
    }
    async getLessonsByTeacher(req) {
        return this.lessonService.getLessonsByTeacher(req.user.Id);
    }
    async getLessonsByStudent(req) {
        return this.lessonService.getLessonsByStudent(req.user.Id);
    }
    async getLessonsByChat(chatId) {
        return this.lessonService.getLessonsByChat(chatId);
    }
    async getAvailableTimeSlots(teacherId, date) {
        return await this.lessonService.getAvailableTimeSlots(teacherId, date);
    }
    async requestReschedule(createRescheduleDto) {
        return await this.lessonService.requestReschedule(createRescheduleDto);
    }
    async approveReschedule(rescheduleId) {
        return await this.lessonService.approveReschedule(rescheduleId);
    }
    async rejectReschedule(rescheduleId, body) {
        return await this.lessonService.rejectReschedule(rescheduleId, body.reason);
    }
    async completeLesson(lessonId) {
        return await this.lessonService.completeLesson(lessonId);
    }
    async cancelLesson(lessonId) {
        return await this.lessonService.cancelLesson(lessonId);
    }
};
exports.LessonController = LessonController;
__decorate([
    (0, common_1.Post)('book'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lesson_dto_1.CreateLessonDto]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "bookLesson", null);
__decorate([
    (0, common_1.Post)('batch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lesson_batch_dto_1.CreateLessonBatchDto]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "createLessonsBatch", null);
__decorate([
    (0, common_1.Get)('teacher'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "getLessonsByTeacher", null);
__decorate([
    (0, common_1.Get)('student'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "getLessonsByStudent", null);
__decorate([
    (0, common_1.Get)('chat/:chatId'),
    __param(0, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "getLessonsByChat", null);
__decorate([
    (0, common_1.Get)('available-slots/:teacherId'),
    __param(0, (0, common_1.Param)('teacherId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "getAvailableTimeSlots", null);
__decorate([
    (0, common_1.Post)('reschedule/request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lesson_reschedule_dto_1.CreateLessonRescheduleDto]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "requestReschedule", null);
__decorate([
    (0, common_1.Put)('reschedule/:rescheduleId/approve'),
    __param(0, (0, common_1.Param)('rescheduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "approveReschedule", null);
__decorate([
    (0, common_1.Put)('reschedule/:rescheduleId/reject'),
    __param(0, (0, common_1.Param)('rescheduleId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "rejectReschedule", null);
__decorate([
    (0, common_1.Put)(':lessonId/complete'),
    __param(0, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "completeLesson", null);
__decorate([
    (0, common_1.Put)(':lessonId/cancel'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "cancelLesson", null);
exports.LessonController = LessonController = __decorate([
    (0, common_1.Controller)('lessons'),
    __metadata("design:paramtypes", [lesson_service_1.LessonService])
], LessonController);
//# sourceMappingURL=lesson.controller.js.map