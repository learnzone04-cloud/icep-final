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
exports.ShortVideoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ShortVideo_1 = require("./entity/ShortVideo");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const notification_service_1 = require("../notification/notification.service");
const recommendation_service_1 = require("../recommendation/services/recommendation.service");
const path = require("path");
const fs = require("fs");
const child_process_1 = require("child_process");
const util_1 = require("util");
let ShortVideoService = class ShortVideoService {
    constructor(shortVideoRepo, userService, notificationService, recommendationService) {
        this.shortVideoRepo = shortVideoRepo;
        this.userService = userService;
        this.notificationService = notificationService;
        this.recommendationService = recommendationService;
    }
    async createShortVideo(id, data, videoFile) {
        const user = await this.userService.findOneById(id);
        if (!user.teacher) {
            throw new common_1.NotFoundException('Only teachers can create short videos');
        }
        if (!user.teacher.type) {
            throw new common_1.NotFoundException('Teacher must have a type assigned');
        }
        const shortVideo = this.shortVideoRepo.create(data);
        shortVideo.type = user.teacher.type;
        shortVideo.teacher = user;
        if (videoFile) {
            const duration = await this.getVideoDuration(videoFile.filename);
            shortVideo.duration = duration;
            if (duration !== 180) {
                if (duration < 120 || duration > 240) {
                    throw new common_1.ForbiddenException('Video duration must be between 2 and 4 minutes');
                }
            }
        }
        else {
            shortVideo.duration = 180;
        }
        const savedShortVideo = await this.shortVideoRepo.save(shortVideo);
        try {
            const teacherName = `${user.fName} ${user.lName}`;
            await this.notificationService.sendShortVideoCreatedNotification(user.teacher.id, teacherName, savedShortVideo.id, savedShortVideo.description);
        }
        catch (error) {
            console.error('Failed to send short video notification:', error);
        }
        return savedShortVideo;
    }
    async getVideoDuration(filename) {
        const execAsync = (0, util_1.promisify)(child_process_1.exec);
        const videoPath = path.join('uploads', 'short-videos', filename);
        try {
            const { stdout } = await execAsync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${videoPath}"`);
            const duration = parseFloat(stdout.trim());
            if (isNaN(duration)) {
                throw new Error('Could not extract video duration');
            }
            return Math.round(duration);
        }
        catch (error) {
            console.error('Error extracting video duration:', error);
            console.log('FFmpeg not available. Using default duration. Duration can be updated manually.');
            return 180;
        }
    }
    find() {
        return this.shortVideoRepo.find({
            relations: [
                'teacher',
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
            console.log('Filtering short videos for student with typeId:', user.typeId);
            const shortVideos = await this.shortVideoRepo.find({
                where: { typeId: user.typeId },
                relations: [
                    'teacher',
                    'likes',
                    'likes.student',
                    'comments',
                    'comments.student',
                ],
            });
            console.log('Found short videos for student:', shortVideos.map(v => ({ id: v.id, typeId: v.typeId, description: v.description })));
            return shortVideos;
        }
        if (user.role === 'Teacher') {
            console.log('Filtering short videos for teacher with userId:', user.id);
            const shortVideos = await this.shortVideoRepo.find({
                where: { teacherId: user.id },
                relations: [
                    'teacher',
                    'likes',
                    'likes.student',
                    'comments',
                    'comments.student',
                ],
            });
            console.log('Found teacher short videos:', shortVideos.map(v => ({ id: v.id, teacherId: v.teacherId, description: v.description })));
            return shortVideos;
        }
        console.log('No valid role found, returning empty array');
        return [];
    }
    async findShortVideosWithRecommendations(userId, userTypeId) {
        const user = await this.userService.findOneById(userId);
        if (!user || user.role !== 'Student') {
            throw new common_1.NotFoundException('Student not found');
        }
        if (!userTypeId) {
            throw new common_1.NotFoundException('User type ID is required');
        }
        const typeId = userTypeId;
        const shortVideos = await this.shortVideoRepo.find({
            where: { typeId: typeId.toString() },
            relations: [
                'teacher',
                'teacher.teacher',
                'likes',
                'likes.student',
                'comments',
                'comments.student',
            ],
        });
        const recommendations = await this.recommendationService.getRecommendations(userId, 'short_video', 1000);
        const recommendationMap = new Map();
        recommendations.forEach(rec => {
            recommendationMap.set(rec.contentId, rec.score);
        });
        const shortVideosWithScores = shortVideos.map(shortVideo => {
            const recommendationScore = recommendationMap.get(shortVideo.id) || 0.5;
            return {
                id: shortVideo.id,
                description: shortVideo.description,
                videoPath: shortVideo.videoPath,
                level: shortVideo.level,
                tags: shortVideo.tags,
                duration: shortVideo.duration,
                typeId: shortVideo.typeId,
                createdAt: shortVideo.createdAt,
                teacher: {
                    id: shortVideo.teacher?.teacher?.id,
                    fName: shortVideo.teacher ? shortVideo.teacher.fName : 'Unknown',
                    lName: shortVideo.teacher ? shortVideo.teacher.lName : 'Unknown',
                    isFollowed: false,
                },
                likesCount: shortVideo.likes?.length || 0,
                commentsCount: shortVideo.comments?.length || 0,
                recommendationScore: recommendationScore,
                rank: recommendationMap.has(shortVideo.id) ? recommendations.find(r => r.contentId === shortVideo.id)?.rank || 999 : 999,
            };
        });
        shortVideosWithScores.sort((a, b) => {
            if (b.recommendationScore !== a.recommendationScore) {
                return b.recommendationScore - a.recommendationScore;
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        return shortVideosWithScores;
    }
    findOneById(id) {
        return this.shortVideoRepo.findOne({
            where: { id: id },
        });
    }
    async update(id, data, user) {
        const shortVideo = await this.findOneById(id);
        if (!shortVideo)
            throw new common_1.NotFoundException('Short Video Not Found');
        if (shortVideo.teacherId !== user.id) {
            throw new common_1.ForbiddenException('You are not allowed to update this short video');
        }
        if (data.description !== undefined) {
            shortVideo.description = data.description;
        }
        if (data.tags !== undefined) {
            shortVideo.tags = data.tags;
        }
        if (data.duration !== undefined || data.typeId !== undefined) {
            throw new common_1.ForbiddenException('Only description and tags can be updated');
        }
        return this.shortVideoRepo.save(shortVideo);
    }
    async delete(id, user) {
        const findShortVideo = await this.findOneById(id);
        if (!findShortVideo)
            throw new common_1.NotFoundException('Short Video Not Found');
        if (findShortVideo.teacherId != user.id) {
            throw new common_1.ForbiddenException('You are not allowed to delete this short video');
        }
        if (findShortVideo.videoPath) {
            const videoFilePath = path.join('uploads', 'short-videos', findShortVideo.videoPath);
            try {
                await fs.promises.unlink(videoFilePath);
                console.log(`Video file deleted: ${videoFilePath}`);
            }
            catch (error) {
                console.error(`Error deleting video file: ${videoFilePath}`, error);
            }
        }
        return this.shortVideoRepo.remove(findShortVideo);
    }
};
exports.ShortVideoService = ShortVideoService;
exports.ShortVideoService = ShortVideoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ShortVideo_1.ShortVideoEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        notification_service_1.NotificationService,
        recommendation_service_1.RecommendationService])
], ShortVideoService);
//# sourceMappingURL=short-video.service.js.map