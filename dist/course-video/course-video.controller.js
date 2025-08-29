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
exports.CourseVideoController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_auth_guard_1 = require("../admin-auth/admin-auth.guard");
const admin_auth_service_1 = require("../admin-auth/admin-auth.service");
const uuid_1 = require("uuid");
const course_video_service_1 = require("./course-video.service");
let CourseVideoController = class CourseVideoController {
    constructor(service, adminAuthService) {
        this.service = service;
        this.adminAuthService = adminAuthService;
    }
    addReel(req, id, video, createTeacherDto) {
        return this.service.create(id, createTeacherDto, video.path);
    }
    async approveCourse(id, req) {
        const youtubeTokens = this.adminAuthService.getYouTubeTokens(req.user.email);
        if (!youtubeTokens) {
            return {
                success: false,
                message: 'Admin does not have YouTube access. Please login again with YouTube permissions.',
                user: req.user
            };
        }
        const result = await this.service.approveVideo(id, youtubeTokens);
        return {
            ...result,
            approvedBy: {
                id: req.user.id,
                email: req.user.email,
                name: req.user.name,
                role: req.user.role
            },
            approvedAt: new Date().toISOString(),
            youtubeAccess: true
        };
    }
    async disapproveVideo(id, req) {
        const youtubeTokens = this.adminAuthService.getYouTubeTokens(req.user.email);
        if (!youtubeTokens) {
            return {
                success: false,
                message: 'Admin does not have YouTube access. Please login again with YouTube permissions.',
                user: req.user
            };
        }
        const result = await this.service.disapproveVideo(id, youtubeTokens);
        return {
            ...result,
            disapprovedBy: {
                id: req.user.id,
                email: req.user.email,
                name: req.user.name,
                role: req.user.role
            },
            disapprovedAt: new Date().toISOString(),
            youtubeAccess: true
        };
    }
    getCourseVideo(id) {
        return this.service.findAllByCourseId(id);
    }
    editVideoDescription(id, body) {
        return this.service.editDescreption(id, body);
    }
    deleteCourseVideo(id) {
        return this.service.delete(id);
    }
};
exports.CourseVideoController = CourseVideoController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('video', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/videos',
            filename: (req, file, callback) => {
                const uniqueFileName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                callback(null, uniqueFileName);
            },
        }),
        fileFilter: (req, file, callback) => {
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, Object]),
    __metadata("design:returntype", Object)
], CourseVideoController.prototype, "addReel", null);
__decorate([
    (0, common_1.Post)('/approve/:id'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CourseVideoController.prototype, "approveCourse", null);
__decorate([
    (0, common_1.Delete)('/disapprove/:id'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CourseVideoController.prototype, "disapproveVideo", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CourseVideoController.prototype, "getCourseVideo", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CourseVideoController.prototype, "editVideoDescription", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CourseVideoController.prototype, "deleteCourseVideo", null);
exports.CourseVideoController = CourseVideoController = __decorate([
    (0, common_1.Controller)('course-video'),
    __metadata("design:paramtypes", [course_video_service_1.CourseVideoService,
        admin_auth_service_1.AdminAuthService])
], CourseVideoController);
//# sourceMappingURL=course-video.controller.js.map