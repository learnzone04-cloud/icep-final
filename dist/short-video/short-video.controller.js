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
exports.ShortVideoController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const short_video_service_1 = require("./short-video.service");
const create_short_video_dto_1 = require("./dtos/create-short-video.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const uuid_1 = require("uuid");
const path_1 = require("path");
const path_2 = require("path");
const fs = require("fs");
const update_short_video_dto_1 = require("./dtos/update-short-video.dto");
let ShortVideoController = class ShortVideoController {
    constructor(shortVideoService) {
        this.shortVideoService = shortVideoService;
    }
    addShortVideo(req, video, createShortVideoDto) {
        if (!video) {
            throw new Error('Video file is required');
        }
        createShortVideoDto.videoPath = video.filename;
        return this.shortVideoService.createShortVideo(req.user.id, createShortVideoDto, video);
    }
    async streamVideo(filename, req, res) {
        const videoPath = (0, path_2.join)('uploads', 'short-videos', filename);
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;
        if (!range) {
            res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            });
            fs.createReadStream(videoPath).pipe(res);
        }
        else {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = end - start + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
        }
    }
    getShortVideos(req) {
        return this.shortVideoService.findByUserType(req.user);
    }
    async getShortVideosWithRecommendations(req) {
        const userId = req.user?.id;
        const typeId = req.user?.typeId;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        if (!typeId) {
            throw new Error('User type not found in token');
        }
        return this.shortVideoService.findShortVideosWithRecommendations(userId, typeId);
    }
    deleteShortVideo(id, req) {
        return this.shortVideoService.delete(id, req.user);
    }
    updateShortVideo(id, body, req) {
        return this.shortVideoService.update(id, body, req.user);
    }
};
exports.ShortVideoController = ShortVideoController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('video', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/short-videos',
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
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_short_video_dto_1.CreateShortVideoDto]),
    __metadata("design:returntype", Object)
], ShortVideoController.prototype, "addShortVideo", null);
__decorate([
    (0, common_1.Get)('stream/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ShortVideoController.prototype, "streamVideo", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShortVideoController.prototype, "getShortVideos", null);
__decorate([
    (0, common_1.Get)('recommendations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShortVideoController.prototype, "getShortVideosWithRecommendations", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ShortVideoController.prototype, "deleteShortVideo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_short_video_dto_1.UpdateShortVideoDto, Object]),
    __metadata("design:returntype", void 0)
], ShortVideoController.prototype, "updateShortVideo", null);
exports.ShortVideoController = ShortVideoController = __decorate([
    (0, common_1.Controller)('short-videos'),
    __metadata("design:paramtypes", [short_video_service_1.ShortVideoService])
], ShortVideoController);
//# sourceMappingURL=short-video.controller.js.map