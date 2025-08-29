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
exports.AdminAuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const admin_auth_service_1 = require("./admin-auth.service");
const admin_auth_guard_1 = require("./admin-auth.guard");
let AdminAuthController = class AdminAuthController {
    constructor(adminAuthService, configService) {
        this.adminAuthService = adminAuthService;
        this.configService = configService;
    }
    async googleAuth() {
    }
    async initiateGoogleAuth(redirectUri) {
        const frontendUrl = redirectUri || this.configService.get('FRONTEND_BASE_URL');
        return {
            authUrl: `/admin/auth/google?redirect_uri=${encodeURIComponent(frontendUrl)}`,
            message: 'Use this URL to initiate Google OAuth2 flow'
        };
    }
    async googleAuthRedirect(req, res, redirectUri) {
        try {
            const result = await this.adminAuthService.generateAdminTokenWithYouTube(req.user, req.user.youtubeTokens);
            const frontendUrl = redirectUri || this.configService.get('FRONTEND_BASE_URL');
            const redirectUrl = new URL('/admin/auth-success', frontendUrl);
            redirectUrl.searchParams.set('accessToken', result.accessToken);
            redirectUrl.searchParams.set('user', JSON.stringify(result.user));
            redirectUrl.searchParams.set('youtubeTokens', JSON.stringify(result.youtubeTokens));
            redirectUrl.searchParams.set('success', 'true');
            res.redirect(redirectUrl.toString());
        }
        catch (error) {
            const frontendUrl = redirectUri || this.configService.get('FRONTEND_BASE_URL');
            const errorUrl = new URL('/admin/auth-error', frontendUrl);
            errorUrl.searchParams.set('error', 'authentication_failed');
            errorUrl.searchParams.set('message', error.message);
            res.redirect(errorUrl.toString());
        }
    }
    async googleAuthCallbackJson(req, res) {
        try {
            const result = await this.adminAuthService.generateAdminTokenWithYouTube(req.user, req.user.youtubeTokens);
            res.json({
                success: true,
                accessToken: result.accessToken,
                user: result.user,
                youtubeTokens: result.youtubeTokens,
                message: result.message
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                error: 'Admin authentication failed',
                message: error.message
            });
        }
    }
    async verifyToken(req) {
        return {
            message: 'Admin token is valid',
            user: req.user,
        };
    }
    async getProfile(req) {
        return {
            message: 'Admin profile',
            user: req.user,
        };
    }
};
exports.AdminAuthController = AdminAuthController;
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('admin-google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/init'),
    __param(0, (0, common_1.Query)('redirect_uri')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "initiateGoogleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('admin-google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('redirect_uri')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Get)('google/callback/json'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('admin-google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "googleAuthCallbackJson", null);
__decorate([
    (0, common_1.Get)('verify'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "getProfile", null);
exports.AdminAuthController = AdminAuthController = __decorate([
    (0, common_1.Controller)('admin/auth'),
    __metadata("design:paramtypes", [admin_auth_service_1.AdminAuthService,
        config_1.ConfigService])
], AdminAuthController);
//# sourceMappingURL=admin-auth.controller.js.map