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
exports.AdminGoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const admin_auth_service_1 = require("./admin-auth.service");
const config_1 = require("@nestjs/config");
let AdminGoogleStrategy = class AdminGoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'admin-google') {
    constructor(adminAuthService, configService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('GOOGLE_ADMIN_CALLBACK_URL'),
            scope: [
                'email',
                'profile',
                'https://www.googleapis.com/auth/youtube.upload',
                'https://www.googleapis.com/auth/gmail.send',
                'https://www.googleapis.com/auth/calendar'
            ],
        });
        this.adminAuthService = adminAuthService;
        this.configService = configService;
    }
    async validate(accessToken, refreshToken, profile) {
        const adminUser = await this.adminAuthService.validateAdminUser(profile);
        const youtubeTokens = { accessToken, refreshToken };
        return {
            ...adminUser,
            youtubeTokens
        };
    }
};
exports.AdminGoogleStrategy = AdminGoogleStrategy;
exports.AdminGoogleStrategy = AdminGoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_auth_service_1.AdminAuthService, config_1.ConfigService])
], AdminGoogleStrategy);
//# sourceMappingURL=admin-google.strategy.js.map