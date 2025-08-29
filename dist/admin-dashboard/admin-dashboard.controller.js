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
exports.AdminDashboardController = void 0;
const common_1 = require("@nestjs/common");
const admin_auth_guard_1 = require("../admin-auth/admin-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const youtube_service_1 = require("../youtube/youtube.service");
let AdminDashboardController = class AdminDashboardController {
    constructor(youtubeService) {
        this.youtubeService = youtubeService;
    }
    async testEndpoint(req) {
        return {
            message: 'Admin dashboard is working!',
            user: req.user,
            timestamp: new Date().toISOString()
        };
    }
    async getDashboard(req) {
        return {
            message: 'Welcome to Admin Dashboard',
            user: req.user,
            features: [
                'YouTube Integration Management',
                'User Management',
                'Content Moderation',
                'Analytics',
                'System Settings'
            ]
        };
    }
    async getYouTubeStatus(req) {
        const hasTokens = this.youtubeService.tokens ? true : false;
        return {
            message: 'YouTube Integration Status',
            user: req.user,
            youtubeConnected: hasTokens,
            channelInfo: hasTokens ? {
                name: 'Your YouTube Channel',
                subscribers: 1000,
                videos: 50
            } : null,
            statusMessage: hasTokens ? 'YouTube API connected' : 'YouTube API not connected. Use /auth/google to connect.'
        };
    }
    async getUserStats(req) {
        return {
            message: 'User Statistics',
            user: req.user,
            stats: {
                totalStudents: 150,
                totalTeachers: 25,
                activeUsers: 120,
                newUsersThisMonth: 15
            }
        };
    }
    async restartSystem(req) {
        return {
            message: 'System restart initiated',
            user: req.user,
            timestamp: new Date().toISOString()
        };
    }
    async uploadVideoToYouTube(req, file, body) {
        try {
            if (!this.youtubeService.tokens) {
                return {
                    success: false,
                    message: 'YouTube API not connected. Please connect YouTube first using /auth/google',
                    user: req.user
                };
            }
            const result = await this.youtubeService.uploadVideo(body.title, body.description, file.path);
            return {
                success: true,
                message: 'Video uploaded to YouTube successfully',
                user: req.user,
                videoId: result.id,
                videoTitle: result.snippet?.title,
                uploadedAt: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to upload video to YouTube',
                error: error.message,
                user: req.user
            };
        }
    }
    async getYouTubeConnectionStatus(req) {
        const hasTokens = this.youtubeService.tokens ? true : false;
        return {
            message: 'YouTube Connection Status',
            user: req.user,
            connected: hasTokens,
            connectionUrl: hasTokens ? null : process.env.FRONTEND_BASE_URL + '/auth/google',
            statusMessage: hasTokens ? 'YouTube API is connected and ready for uploads' : 'Click the connection URL to connect YouTube API'
        };
    }
    async refreshYouTubeTokens(req) {
        try {
            await this.youtubeService.refreshAccessToken();
            return {
                success: true,
                message: 'YouTube tokens refreshed successfully',
                user: req.user,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to refresh YouTube tokens',
                error: error.message,
                user: req.user
            };
        }
    }
};
exports.AdminDashboardController = AdminDashboardController;
__decorate([
    (0, common_1.Get)('test'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "testEndpoint", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('youtube-status'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getYouTubeStatus", null);
__decorate([
    (0, common_1.Get)('users/stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Post)('system/restart'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "restartSystem", null);
__decorate([
    (0, common_1.Post)('youtube/upload-video'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('videoFile')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "uploadVideoToYouTube", null);
__decorate([
    (0, common_1.Get)('youtube/connect-status'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getYouTubeConnectionStatus", null);
__decorate([
    (0, common_1.Post)('youtube/refresh-tokens'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "refreshYouTubeTokens", null);
exports.AdminDashboardController = AdminDashboardController = __decorate([
    (0, common_1.Controller)('admin/dashboard'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __metadata("design:paramtypes", [youtube_service_1.YoutubeService])
], AdminDashboardController);
//# sourceMappingURL=admin-dashboard.controller.js.map