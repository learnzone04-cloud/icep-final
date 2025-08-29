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
exports.CourseVideoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const course_video_entity_1 = require("./entity/course-video.entity");
const typeorm_2 = require("typeorm");
const course_service_1 = require("../course/course.service");
const youtube_service_1 = require("../youtube/youtube.service");
const fs = require("fs");
let CourseVideoService = class CourseVideoService {
    constructor(repo, courseService, youtubeService) {
        this.repo = repo;
        this.courseService = courseService;
        this.youtubeService = youtubeService;
    }
    async create(id, body, path) {
        const course = await this.courseService.findOne(id);
        const lastVideo = await this.repo.findOne({
            where: { courseId: id },
            order: { number: 'DESC' }
        });
        const nextNumber = lastVideo ? lastVideo.number + 1 : 1;
        const video = this.repo.create(body);
        video.course = course;
        video.number = nextNumber;
        video.path = path;
        const tt = await this.repo.save(video);
        return tt;
    }
    findOne(id) {
        return this.repo.findOne({ where: { id: id } });
    }
    findAllByCourseId(courseId) {
        return this.repo.find({ where: { courseId: courseId } });
    }
    async approveVideo(id, youtubeTokens) {
        const videoLocal = await this.findOne(id);
        if (!youtubeTokens) {
            throw new Error('YouTube tokens are required for video approval. Please login as admin with YouTube permissions.');
        }
        if (!youtubeTokens.accessToken) {
            throw new Error('Invalid YouTube tokens: accessToken is missing');
        }
        const originalTokens = this.youtubeService.tokens;
        this.youtubeService.setTokensAndConfigure(youtubeTokens);
        try {
            const video = await this.youtubeService.uploadVideo(videoLocal.title, videoLocal.description, videoLocal.path);
            videoLocal.videoUrl = `https://youtu.be/${video.id}`;
            videoLocal.privacyStatus = video.status.privacyStatus;
            videoLocal.thumbnail_url = video.snippet.thumbnails.medium.url;
            videoLocal.youtubeVideoId = video.id;
            videoLocal.approaved = true;
            fs.unlink(videoLocal.path, (err) => { });
            videoLocal.path = null;
            await this.repo.save(videoLocal);
            return video;
        }
        catch (error) {
            throw new Error(`Failed to upload video to YouTube: ${error.message}`);
        }
        finally {
            if (originalTokens) {
                this.youtubeService.setTokensAndConfigure(originalTokens);
            }
            else {
                this.youtubeService.tokens = null;
                this.youtubeService.oauth2Client.setCredentials({});
            }
        }
    }
    async disapproveVideo(id, youtubeTokens) {
        const videoLocal = await this.findOne(id);
        if (!videoLocal) {
            throw new Error('Video not found');
        }
        if (videoLocal.youtubeVideoId && videoLocal.approaved) {
            if (!youtubeTokens) {
                throw new Error('YouTube tokens are required to remove approved videos. Please login as admin with YouTube permissions.');
            }
            if (!youtubeTokens.accessToken) {
                throw new Error('Invalid YouTube tokens: accessToken is missing');
            }
            const originalTokens = this.youtubeService.tokens;
            this.youtubeService.setTokensAndConfigure(youtubeTokens);
            try {
                await this.youtubeService.deleteVideo(videoLocal.youtubeVideoId);
                if (videoLocal.path && fs.existsSync(videoLocal.path)) {
                    fs.unlinkSync(videoLocal.path);
                }
                await this.repo.remove(videoLocal);
                return {
                    success: true,
                    message: 'Approved video successfully removed from YouTube and database',
                    deletedVideoId: videoLocal.youtubeVideoId,
                    deletedLocalId: id
                };
            }
            finally {
                if (originalTokens) {
                    this.youtubeService.setTokensAndConfigure(originalTokens);
                }
                else {
                    this.youtubeService.tokens = null;
                    this.youtubeService.oauth2Client.setCredentials({});
                }
            }
        }
        else {
            try {
                if (videoLocal.path && fs.existsSync(videoLocal.path)) {
                    fs.unlinkSync(videoLocal.path);
                }
                await this.repo.remove(videoLocal);
                return {
                    success: true,
                    message: 'Unapproved video successfully removed from database and local storage',
                    deletedLocalId: id,
                    wasApproved: false
                };
            }
            catch (error) {
                throw new Error(`Failed to remove unapproved video: ${error.message}`);
            }
        }
    }
    async editDescreption(id, body) {
        const videoLocal = await this.findOne(id);
        videoLocal.description = body.description;
        await this.repo.save(videoLocal);
        return body;
    }
    async delete(id) {
        const video = await this.findOne(id);
        if (!video)
            throw new Error('Course video not found');
        if (video.path) {
            fs.unlink(video.path, (err) => { });
        }
        return this.repo.remove(video);
    }
};
exports.CourseVideoService = CourseVideoService;
exports.CourseVideoService = CourseVideoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_video_entity_1.CourseVideoEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        course_service_1.CourseService,
        youtube_service_1.YoutubeService])
], CourseVideoService);
//# sourceMappingURL=course-video.service.js.map