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
exports.ExamController = void 0;
const common_1 = require("@nestjs/common");
const exam_service_1 = require("./exam.service");
const create_exam_dto_1 = require("./dto/create-exam.dto");
const update_exam_dto_1 = require("./dto/update-exam.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ExamController = class ExamController {
    constructor(examService) {
        this.examService = examService;
    }
    async create(createExamDto) {
        return this.examService.create(createExamDto);
    }
    async update(id, updateExamDto) {
        return this.examService.update(+id, updateExamDto);
    }
    async remove(id) {
        return this.examService.remove(+id);
    }
    async getSpecificVideoExam(videoId, courseId) {
        return this.examService.getSpecificVideoExam(videoId, courseId);
    }
    async getStudentMidFinalExams(courseId, req) {
        const userId = req.user.id;
        return this.examService.getStudentMidFinalExams(userId, courseId);
    }
    async getExamsByTeacherAndCourse(req, courseId) {
        return this.examService.getExamsByTeacherAndCourse(req.user.id, courseId);
    }
};
exports.ExamController = ExamController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_exam_dto_1.CreateExamDto]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_exam_dto_1.UpdateExamDto]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('video/:videoId/course/:courseId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('videoId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('courseId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "getSpecificVideoExam", null);
__decorate([
    (0, common_1.Get)('student-mid-final/:courseId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "getStudentMidFinalExams", null);
__decorate([
    (0, common_1.Get)('by-teacher/course/:courseId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('courseId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "getExamsByTeacherAndCourse", null);
exports.ExamController = ExamController = __decorate([
    (0, common_1.Controller)('exams'),
    __metadata("design:paramtypes", [exam_service_1.ExamService])
], ExamController);
//# sourceMappingURL=exam.controller.js.map