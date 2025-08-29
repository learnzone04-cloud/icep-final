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
exports.StoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Story_1 = require("./entity/Story");
const StoryLike_1 = require("./entity/StoryLike");
const Teacher_1 = require("../teacher/entity/Teacher");
const Student_1 = require("../student/entity/Student");
const follower_entity_1 = require("../follower/entities/follower.entity");
const fs = require("fs");
const story_gateway_1 = require("./story.gateway");
const follower_service_1 = require("../follower/follower.service");
let StoryService = class StoryService {
    constructor(storyRepo, storyLikeRepo, teacherRepo, studentRepo, followerRepo, storyGateway, followerService) {
        this.storyRepo = storyRepo;
        this.storyLikeRepo = storyLikeRepo;
        this.teacherRepo = teacherRepo;
        this.studentRepo = studentRepo;
        this.followerRepo = followerRepo;
        this.storyGateway = storyGateway;
        this.followerService = followerService;
    }
    async createStory(teacherId, createStoryDto) {
        if (!createStoryDto.mediaUrl && !createStoryDto.content) {
            throw new common_1.BadRequestException('Must provide either media URL or content');
        }
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        const story = this.storyRepo.create({
            ...createStoryDto,
            teacherId,
            expiresAt,
        });
        const savedStory = await this.storyRepo.save(story);
        const followerUserIds = await this.followerService.getFollowerUserIdsForTeacher(teacherId);
        this.storyGateway.emitStoryCreated(savedStory, followerUserIds);
        return savedStory;
    }
    async getStoriesForStudent(studentId) {
        const followedTeachers = await this.followerRepo.find({
            where: { studentId },
            relations: ['teacher'],
        });
        if (followedTeachers.length === 0) {
            return [];
        }
        const teacherIds = followedTeachers.map(f => f.teacherId);
        const now = new Date();
        return this.storyRepo.find({
            where: {
                teacherId: (0, typeorm_2.In)(teacherIds),
                expiresAt: (0, typeorm_2.MoreThan)(now),
                isExpired: false,
            },
            relations: ['teacher', 'teacher.user', 'likes'],
            order: { createdAt: 'DESC' },
        });
    }
    async getTeacherStories(teacherId) {
        const now = new Date();
        return this.storyRepo.find({
            where: {
                teacherId,
                expiresAt: (0, typeorm_2.MoreThan)(now),
                isExpired: false,
            },
            relations: ['likes', 'likes.student', 'likes.student.user', 'teacher', 'teacher.user'],
            order: { createdAt: 'DESC' },
        });
    }
    async likeStory(storyId, studentId) {
        const story = await this.storyRepo.findOne({
            where: { id: storyId },
            relations: ['teacher'],
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found');
        }
        if (story.isExpiredNow) {
            throw new common_1.BadRequestException('Cannot like expired story');
        }
        const isFollowing = await this.followerRepo.findOne({
            where: { studentId, teacherId: story.teacherId },
        });
        if (!isFollowing) {
            throw new common_1.ForbiddenException('You can only like stories from teachers you follow');
        }
        const existingLike = await this.storyLikeRepo.findOne({
            where: { storyId, studentId },
        });
        if (existingLike) {
            throw new common_1.BadRequestException('You have already liked this story');
        }
        const like = this.storyLikeRepo.create({
            storyId,
            studentId,
        });
        await this.storyLikeRepo.save(like);
    }
    async deleteStory(storyId, teacherId) {
        const story = await this.storyRepo.findOne({
            where: { id: storyId, teacherId },
        });
        if (!story) {
            throw new common_1.NotFoundException('Story not found or you do not have permission to delete it');
        }
        if (story.mediaUrl && fs.existsSync(story.mediaUrl)) {
            try {
                fs.unlinkSync(story.mediaUrl);
                console.log(`Deleted story file: ${story.mediaUrl}`);
            }
            catch (error) {
                console.error(`Failed to delete story file ${story.mediaUrl}:`, error);
            }
        }
        await this.storyLikeRepo.delete({ storyId });
        await this.storyRepo.remove(story);
        const followerUserIds = await this.followerService.getFollowerUserIdsForTeacher(teacherId);
        this.storyGateway.emitStoryDeleted(storyId, followerUserIds);
    }
    async getStoryLikes(storyId) {
        return this.storyLikeRepo.find({
            where: { storyId },
            relations: ['student', 'student.user'],
        });
    }
    async cleanupExpiredStories() {
        const now = new Date();
        const expiredStories = await this.storyRepo.find({
            where: {
                expiresAt: (0, typeorm_2.LessThan)(now),
                isExpired: false
            },
            select: ['id', 'mediaUrl']
        });
        for (const story of expiredStories) {
            if (story.mediaUrl && fs.existsSync(story.mediaUrl)) {
                try {
                    fs.unlinkSync(story.mediaUrl);
                    console.log(`Deleted file: ${story.mediaUrl}`);
                }
                catch (error) {
                    console.error(`Failed to delete file ${story.mediaUrl}:`, error);
                }
            }
        }
        await this.storyRepo.update({
            expiresAt: (0, typeorm_2.LessThan)(now),
            isExpired: false
        }, { isExpired: true });
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const oldStories = await this.storyRepo.find({
            where: { expiresAt: (0, typeorm_2.LessThan)(sevenDaysAgo) },
            select: ['id', 'mediaUrl']
        });
        for (const story of oldStories) {
            if (story.mediaUrl && fs.existsSync(story.mediaUrl)) {
                try {
                    fs.unlinkSync(story.mediaUrl);
                    console.log(`Deleted old story file: ${story.mediaUrl}`);
                }
                catch (error) {
                    console.error(`Failed to delete old story file ${story.mediaUrl}:`, error);
                }
            }
        }
        await this.storyLikeRepo.delete({
            storyId: (0, typeorm_2.In)(oldStories.map(s => s.id))
        });
        await this.storyRepo.delete({
            expiresAt: (0, typeorm_2.LessThan)(sevenDaysAgo),
        });
    }
};
exports.StoryService = StoryService;
exports.StoryService = StoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Story_1.Story)),
    __param(1, (0, typeorm_1.InjectRepository)(StoryLike_1.StoryLike)),
    __param(2, (0, typeorm_1.InjectRepository)(Teacher_1.TeacherEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(Student_1.Student)),
    __param(4, (0, typeorm_1.InjectRepository)(follower_entity_1.Follower)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        story_gateway_1.StoryGateway,
        follower_service_1.FollowerService])
], StoryService);
//# sourceMappingURL=story.service.js.map