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
exports.ReelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Reel_1 = require("./entity/Reel");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const notification_service_1 = require("../notification/notification.service");
const recommendation_service_1 = require("../recommendation/services/recommendation.service");
const path = require("path");
const fs = require("fs");
const child_process_1 = require("child_process");
const util_1 = require("util");
let ReelsService = class ReelsService {
    constructor(reelRepo, userService, notificationService, recommendationService) {
        this.reelRepo = reelRepo;
        this.userService = userService;
        this.notificationService = notificationService;
        this.recommendationService = recommendationService;
    }
    async createReel(id, data, videoFile) {
        const user = await this.userService.findOneById(id);
        if (!user.teacher) {
            throw new common_1.NotFoundException('Only teachers can create reels');
        }
        if (!user.teacher.type) {
            throw new common_1.NotFoundException('Teacher must have a type assigned');
        }
        const reel = this.reelRepo.create(data);
        reel.type = user.teacher.type;
        reel.user = user;
        if (videoFile) {
            const duration = await this.getVideoDuration(videoFile.filename);
            reel.duration = duration;
            if (duration < 10 || duration > 60) {
                throw new common_1.ForbiddenException('Reel duration must be between 10 seconds and 1 minute');
            }
        }
        else {
            throw new common_1.ForbiddenException('Video file is required for reels');
        }
        const savedReel = await this.reelRepo.save(reel);
        try {
            const teacherName = `${user.fName} ${user.lName}`;
            await this.notificationService.sendReelCreatedNotification(user.teacher.id, teacherName, savedReel.id, savedReel.description);
        }
        catch (error) {
            console.error('Failed to send reel notification:', error);
        }
        return savedReel;
    }
    async getVideoDuration(filename) {
        const execAsync = (0, util_1.promisify)(child_process_1.exec);
        const videoPath = path.join('uploads', 'videos', filename);
        try {
            const command = `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${videoPath}"`;
            const { stdout } = await execAsync(command);
            const duration = parseFloat(stdout.trim());
            if (isNaN(duration)) {
                throw new Error('Could not extract video duration');
            }
            return Math.round(duration);
        }
        catch (error) {
            console.error('Error extracting video duration:', error);
            console.log('FFmpeg not available. Using default duration. Duration can be updated manually.');
            return 30;
        }
    }
    find() {
        return this.reelRepo.find({
            relations: [
                'user',
                'likes',
                'likes.student',
                'comments',
                'comments.student',
            ],
        });
    }
    async findByUserType(user) {
        console.log('User from JWT:', user);
        console.log('User role:', user.role);
        console.log('User typeId:', user.typeId);
        if (user.role === 'Student' && user.typeId) {
            console.log('Filtering reels for student with typeId:', user.typeId);
            const reels = await this.reelRepo.find({
                where: { typeId: user.typeId },
                relations: [
                    'user',
                    'likes',
                    'likes.student',
                    'comments',
                    'comments.student',
                ],
            });
            console.log('Found reels for student:', reels.map(r => ({ id: r.id, typeId: r.typeId, description: r.description })));
            return reels;
        }
        if (user.role === 'Teacher') {
            console.log('Filtering reels for teacher with userId:', user.id);
            const reels = await this.reelRepo.find({
                where: { userId: user.id },
                relations: [
                    'user',
                    'likes',
                    'likes.student',
                    'comments',
                    'comments.student',
                ],
            });
            console.log('Found teacher reels:', reels.map(r => ({ id: r.id, userId: r.id, description: r.description })));
            return reels;
        }
        console.log('No valid role found, returning empty array');
        return [];
    }
    async findReelsWithRecommendations(userId, userTypeId) {
        const user = await this.userService.findOneById(userId);
        if (!user || user.role !== 'Student') {
            throw new common_1.NotFoundException('Student not found');
        }
        if (!userTypeId) {
            throw new common_1.NotFoundException('User type ID is required');
        }
        const typeId = userTypeId;
        const reels = await this.reelRepo.find({
            where: { typeId: typeId.toString() },
            relations: [
                'user',
                'user.teacher',
                'likes',
                'likes.student',
                'comments',
                'comments.student',
            ],
        });
        const recommendations = await this.recommendationService.getRecommendations(userId, 'reel', 1000);
        const recommendationMap = new Map();
        recommendations.forEach(rec => {
            recommendationMap.set(rec.contentId, rec.score);
        });
        const reelsWithScores = reels.map(reel => {
            const recommendationScore = recommendationMap.get(reel.id) || 0.5;
            return {
                id: reel.id,
                description: reel.description,
                reelPath: reel.reelPath,
                level: reel.level,
                tags: reel.tags,
                duration: reel.duration,
                typeId: reel.typeId,
                createdAt: reel.createdAt,
                user: {
                    id: reel.user?.teacher?.id,
                    fName: reel.user ? reel.user.fName : 'Unknown',
                    lName: reel.user ? reel.user.lName : 'Unknown',
                    isFollowed: false,
                },
                likesCount: reel.likes?.length || 0,
                commentsCount: reel.comments?.length || 0,
                recommendationScore: recommendationScore,
                rank: recommendationMap.has(reel.id) ? recommendations.find(r => r.contentId === reel.id)?.rank || 999 : 999,
            };
        });
        reelsWithScores.sort((a, b) => {
            if (b.recommendationScore !== a.recommendationScore) {
                return b.recommendationScore - a.recommendationScore;
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        return reelsWithScores;
    }
    findOneById(id) {
        return this.reelRepo.findOne({
            where: { id: id },
        });
    }
    async update(id, data) {
        const reel = await this.findOneById(id);
        if (!reel)
            throw new common_1.NotFoundException('Reel Not Found');
        if (data.description !== undefined) {
            reel.description = data.description;
        }
        if (data.tags !== undefined) {
            reel.tags = data.tags;
        }
        return this.reelRepo.save(reel);
    }
    async delete(id, user) {
        const findReel = await this.findOneById(id);
        if (!findReel)
            throw new common_1.NotFoundException('Reel Not Found');
        if (findReel.userId != user.id) {
            throw new common_1.ForbiddenException('You are not allowed to delete this reel');
        }
        if (findReel.reelPath) {
            const videoFilePath = path.join('uploads', 'videos', findReel.reelPath);
            try {
                await fs.promises.unlink(videoFilePath);
                console.log(`Reel video file deleted: ${videoFilePath}`);
            }
            catch (error) {
                console.error(`Error deleting reel video file: ${videoFilePath}`, error);
            }
        }
        return this.reelRepo.remove(findReel);
    }
};
exports.ReelsService = ReelsService;
exports.ReelsService = ReelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Reel_1.ReelEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        notification_service_1.NotificationService,
        recommendation_service_1.RecommendationService])
], ReelsService);
//# sourceMappingURL=reels.service.js.map