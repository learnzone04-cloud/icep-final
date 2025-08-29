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
exports.ReelsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const reels_service_1 = require("./reels.service");
const create_reel_dto_1 = require("./dtos/create-reel.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const uuid_1 = require("uuid");
const path_1 = require("path");
const path_2 = require("path");
const fs = require("fs");
const update_reel_dto_1 = require("./dtos/update-reel.dto");
let ReelsController = class ReelsController {
    constructor(reelService) {
        this.reelService = reelService;
    }
    addReel(req, video, createTeacherDto) {
        if (!video) {
            throw new Error('Video file is required');
        }
        createTeacherDto.reelPath = video.filename;
        return this.reelService.createReel(req.user.id, createTeacherDto, video);
    }
    async streamVideo(filename, req, res) {
        const videoPath = (0, path_2.join)('uploads', 'videos', filename);
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
    getReel(req) {
        return this.reelService.findByUserType(req.user);
    }
    async getReelsWithRecommendations(req) {
        const userId = req.user?.id;
        const typeId = req.user?.typeId;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        if (!typeId) {
            throw new Error('User type not found in token');
        }
        return this.reelService.findReelsWithRecommendations(userId, typeId);
    }
    deleteReel(id, req) {
        return this.reelService.delete(id, req.user);
    }
    updateReel(id, body) {
        return this.reelService.update(id, body);
    }
};
exports.ReelsController = ReelsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/'),
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
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_reel_dto_1.CreateReelDto]),
    __metadata("design:returntype", Object)
], ReelsController.prototype, "addReel", null);
__decorate([
    (0, common_1.Get)('stream/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReelsController.prototype, "streamVideo", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReelsController.prototype, "getReel", null);
__decorate([
    (0, common_1.Get)('recommendations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReelsController.prototype, "getReelsWithRecommendations", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ReelsController.prototype, "deleteReel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_reel_dto_1.UpdateReelDto]),
    __metadata("design:returntype", void 0)
], ReelsController.prototype, "updateReel", null);
exports.ReelsController = ReelsController = __decorate([
    (0, common_1.Controller)('reels'),
    __metadata("design:paramtypes", [reels_service_1.ReelsService])
], ReelsController);
//# sourceMappingURL=reels.controller.js.map