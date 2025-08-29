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
exports.StoryController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const story_service_1 = require("./story.service");
const create_story_dto_1 = require("./dto/create-story.dto");
const Teacher_1 = require("../teacher/entity/Teacher");
const Student_1 = require("../student/entity/Student");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let StoryController = class StoryController {
    constructor(storyService, teacherRepo, studentRepo) {
        this.storyService = storyService;
        this.teacherRepo = teacherRepo;
        this.studentRepo = studentRepo;
    }
    async createStory(createStoryDto, file, req) {
        const userId = req.user.id;
        const teacher = await this.teacherRepo.findOne({ where: { userId } });
        if (!teacher) {
            throw new Error('Teacher not found');
        }
        if (file) {
            createStoryDto.mediaUrl = file.path;
        }
        if (!file && !createStoryDto.content) {
            throw new Error('Must provide either a photo or text content');
        }
        return this.storyService.createStory(teacher.id, createStoryDto);
    }
    async getStoriesForStudent(req) {
        const userId = req.user.id;
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student) {
            throw new Error('Student not found');
        }
        return this.storyService.getStoriesForStudent(student.id);
    }
    async getMyStories(req) {
        const userId = req.user.id;
        const teacher = await this.teacherRepo.findOne({ where: { userId } });
        if (!teacher) {
            throw new Error('Teacher not found');
        }
        return this.storyService.getTeacherStories(teacher.id);
    }
    async likeStory(storyId, req) {
        const userId = req.user.id;
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student) {
            throw new Error('Student not found');
        }
        await this.storyService.likeStory(parseInt(storyId), student.id);
        return { message: 'Story liked successfully' };
    }
    async getStoryLikes(storyId) {
        return this.storyService.getStoryLikes(parseInt(storyId));
    }
    async deleteStory(storyId, req) {
        const userId = req.user.id;
        const teacher = await this.teacherRepo.findOne({ where: { userId } });
        if (!teacher) {
            throw new Error('Teacher not found');
        }
        await this.storyService.deleteStory(parseInt(storyId), teacher.id);
        return { message: 'Story deleted successfully' };
    }
    async cleanupExpiredStories() {
        await this.storyService.cleanupExpiredStories();
        return { message: 'Expired stories cleaned up successfully' };
    }
};
exports.StoryController = StoryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/stories',
            filename: (req, file, callback) => {
                const uniqueFileName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                callback(null, uniqueFileName);
            },
        }),
        fileFilter: (req, file, callback) => {
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_story_dto_1.CreateStoryDto, Object, Object]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "createStory", null);
__decorate([
    (0, common_1.Get)('for-student'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "getStoriesForStudent", null);
__decorate([
    (0, common_1.Get)('my-stories'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "getMyStories", null);
__decorate([
    (0, common_1.Post)(':storyId/like'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "likeStory", null);
__decorate([
    (0, common_1.Get)(':storyId/likes'),
    __param(0, (0, common_1.Param)('storyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "getStoryLikes", null);
__decorate([
    (0, common_1.Delete)(':storyId'),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "deleteStory", null);
__decorate([
    (0, common_1.Post)('cleanup-expired'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StoryController.prototype, "cleanupExpiredStories", null);
exports.StoryController = StoryController = __decorate([
    (0, common_1.Controller)('stories'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(1, (0, typeorm_1.InjectRepository)(Teacher_1.TeacherEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(Student_1.Student)),
    __metadata("design:paramtypes", [story_service_1.StoryService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StoryController);
//# sourceMappingURL=story.controller.js.map