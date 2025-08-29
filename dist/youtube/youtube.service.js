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
exports.YoutubeService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
const fs = require("fs");
let YoutubeService = class YoutubeService {
    constructor() {
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CALLBACK_URL);
        this.youtube = googleapis_1.google.youtube({
            version: 'v3',
            auth: this.oauth2Client,
        });
    }
    async getAccessToken(code) {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);
        return tokens;
    }
    setTokens(tokens) {
        this.tokens = tokens;
        this.oauth2Client.setCredentials(tokens);
    }
    setTokensAndConfigure(tokens) {
        this.tokens = tokens;
        this.oauth2Client.setCredentials({
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            scope: tokens.scope || 'https://www.googleapis.com/auth/youtube.upload'
        });
    }
    async refreshAccessToken() {
        if (!this.tokens || !this.tokens.refresh_token)
            throw new Error("No refresh token available.");
        const { credentials } = await this.oauth2Client.refreshToken(this.tokens.refresh_token);
        this.oauth2Client.setCredentials(credentials);
        this.tokens = credentials;
    }
    async uploadVideo(title, description, filePath) {
        if (!this.oauth2Client.credentials || !this.oauth2Client.credentials.access_token) {
            throw new Error("YouTube credentials not set. Please authenticate first.");
        }
        const fileStream = fs.createReadStream(filePath);
        const response = await this.youtube.videos.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title,
                    description,
                },
                status: {
                    privacyStatus: 'Unlisted',
                },
            },
            media: {
                body: fileStream,
            },
        });
        return response.data;
    }
    async deleteVideo(videoId) {
        if (!this.oauth2Client.credentials || !this.oauth2Client.credentials.access_token) {
            throw new Error("YouTube credentials not set. Please authenticate first.");
        }
        try {
            const response = await this.youtube.videos.delete({
                id: videoId,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to delete video from YouTube: ${error.message}`);
        }
    }
};
exports.YoutubeService = YoutubeService;
exports.YoutubeService = YoutubeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], YoutubeService);
//# sourceMappingURL=youtube.service.js.map