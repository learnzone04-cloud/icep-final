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
exports.TeacherController = void 0;
const common_1 = require("@nestjs/common");
const teacher_service_1 = require("./teacher.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const platform_express_1 = require("@nestjs/platform-express");
const update_teacher_profile_dto_1 = require("./dtos/update-teacher-profile.dto");
let TeacherController = class TeacherController {
    constructor(teacherService) {
        this.teacherService = teacherService;
    }
    findAll(req) {
        return this.teacherService.findByUserType(req.user);
    }
    findOne(req, id) {
        return this.teacherService.findOneByUserType(req.user, id);
    }
    async completeProfile(req, files, id) {
        const cvPath = files.cv[0]?.filename;
        const certificatePaths = files.certificates.map((file) => file.filename);
        const createTeacherDto = { ...req.body };
        return this.teacherService.createTeacher(id, cvPath, certificatePaths, createTeacherDto);
    }
    async updateTeacherProfile(req, updateTeacherProfileDto) {
        const userId = req.user.id;
        console.log(req.body);
        return this.teacherService.updateProfile(userId, updateTeacherProfileDto);
    }
    async updateTeacherCV(req, files) {
        const userId = req.user.id;
        const cvPath = files.cv?.[0]?.filename;
        if (!cvPath) {
            throw new Error('CV file is required');
        }
        return this.teacherService.updateCV(userId, cvPath);
    }
    async getTeacherArticles(req) {
        const userId = req.user.id;
        return this.teacherService.getTeacherArticles(userId);
    }
    async getTeacherReels(req) {
        const userId = req.user.id;
        return this.teacherService.getTeacherReels(userId);
    }
    async getTeacherCourses(req) {
        const userId = req.user.id;
        return this.teacherService.getTeacherCourses(userId);
    }
};
exports.TeacherController = TeacherController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'certificates', maxCount: 10 },
        { name: 'cv', maxCount: 1 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/teacher',
            filename: (req, file, callback) => {
                const uniqueFileName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                callback(null, uniqueFileName);
            },
        }),
        fileFilter: (req, file, callback) => {
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "completeProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_teacher_profile_dto_1.UpdateTeacherProfileDto]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "updateTeacherProfile", null);
__decorate([
    (0, common_1.Put)('profile/cv'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'cv', maxCount: 1 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/teacher',
            filename: (req, file, callback) => {
                const uniqueFileName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                callback(null, uniqueFileName);
            },
        }),
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "updateTeacherCV", null);
__decorate([
    (0, common_1.Get)('articles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "getTeacherArticles", null);
__decorate([
    (0, common_1.Get)('reels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "getTeacherReels", null);
__decorate([
    (0, common_1.Get)('courses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "getTeacherCourses", null);
exports.TeacherController = TeacherController = __decorate([
    (0, common_1.Controller)('teacher'),
    __metadata("design:paramtypes", [teacher_service_1.TeacherService])
], TeacherController);
//# sourceMappingURL=teacher.controller.js.map