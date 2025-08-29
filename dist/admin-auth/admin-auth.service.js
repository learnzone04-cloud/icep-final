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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AdminAuthService = class AdminAuthService {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.ALLOWED_ADMIN_EMAILS = ['learnzone04@gmail.com'];
        this.youtubeTokensStore = new Map();
    }
    async validateAdminUser(profile) {
        const email = profile.emails[0]?.value;
        if (!email) {
            throw new common_1.UnauthorizedException('Email not found in Google profile');
        }
        if (!this.ALLOWED_ADMIN_EMAILS.includes(email)) {
            throw new common_1.UnauthorizedException('This email is not authorized for admin access');
        }
        return {
            id: profile.id,
            email: email,
            name: profile.displayName,
            picture: profile.photos[0]?.value,
            role: 'Admin',
        };
    }
    async generateAdminToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: 'Admin',
            picture: user.picture,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                picture: user.picture,
                role: 'Admin',
            },
        };
    }
    async generateAdminTokenWithYouTube(user, youtubeTokens) {
        const adminToken = await this.generateAdminToken(user);
        this.youtubeTokensStore.set(user.email, youtubeTokens);
        return {
            ...adminToken,
            youtubeTokens: {
                accessToken: youtubeTokens.accessToken,
                refreshToken: youtubeTokens.refreshToken,
                scope: 'https://www.googleapis.com/auth/youtube.upload,https://www.googleapis.com/auth/gmail.send'
            },
            message: 'Admin authentication successful with YouTube and Gmail access. Use this token for admin APIs, YouTube operations, and email notifications.'
        };
    }
    getYouTubeTokens(adminEmail) {
        return this.youtubeTokensStore.get(adminEmail);
    }
    hasYouTubeAccess(adminEmail) {
        return this.youtubeTokensStore.has(adminEmail);
    }
    async verifyAdminToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            if (!this.ALLOWED_ADMIN_EMAILS.includes(payload.email)) {
                throw new common_1.UnauthorizedException('Admin access revoked');
            }
            return payload;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid admin token');
        }
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], AdminAuthService);
//# sourceMappingURL=admin-auth.service.js.map