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
var RecommendationGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const recommendation_service_1 = require("../services/recommendation.service");
let RecommendationGateway = RecommendationGateway_1 = class RecommendationGateway {
    constructor(recommendationService) {
        this.recommendationService = recommendationService;
        this.logger = new common_1.Logger(RecommendationGateway_1.name);
        this.userSessions = new Map();
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        for (const [sessionId, session] of this.userSessions.entries()) {
            if (session.sessionId === client.id) {
                this.userSessions.delete(sessionId);
                break;
            }
        }
    }
    handleJoinSession(data, client) {
        const { userId, sessionId } = data;
        this.userSessions.set(sessionId, {
            userId,
            sessionId,
            recentInteractions: [],
        });
        client.join(`user-${userId}`);
        this.logger.log(`User ${userId} joined recommendation session ${sessionId}`);
        client.emit('session-joined', {
            success: true,
            sessionId,
            message: 'Successfully joined recommendation session',
        });
    }
    handleSessionInteraction(data, client) {
        const { sessionId, contentType, contentTags, engagement } = data;
        const userSession = this.userSessions.get(sessionId);
        if (!userSession) {
            client.emit('error', { message: 'Session not found' });
            return;
        }
        userSession.recentInteractions.push({
            contentType,
            contentTags,
            engagement,
            timestamp: new Date(),
        });
        if (userSession.recentInteractions.length > 10) {
            userSession.recentInteractions.shift();
        }
        this.logger.log(`Tracked session interaction for user ${userSession.userId}: ${contentType} with ${engagement} engagement`);
        client.emit('interaction-tracked', {
            success: true,
            contentType,
            engagement,
            sessionInteractionsCount: userSession.recentInteractions.length,
        });
    }
    async handleGetSessionRecommendations(data, client) {
        const { sessionId, contentType, limit = 20 } = data;
        const userSession = this.userSessions.get(sessionId);
        if (!userSession) {
            client.emit('error', { message: 'Session not found' });
            return;
        }
        try {
            const baseRecommendations = await this.recommendationService.getRecommendations(userSession.userId, contentType, limit);
            const adjustedRecommendations = this.applySessionAdjustments(baseRecommendations, userSession.recentInteractions);
            client.emit('session-recommendations', {
                success: true,
                recommendations: adjustedRecommendations,
                sessionInteractionsCount: userSession.recentInteractions.length,
                adjustmentsApplied: adjustedRecommendations.length > 0,
            });
        }
        catch (error) {
            this.logger.error(`Error getting session recommendations for user ${userSession.userId}`, error);
            client.emit('error', { message: 'Failed to get recommendations' });
        }
    }
    applySessionAdjustments(baseRecommendations, recentInteractions) {
        if (recentInteractions.length === 0) {
            return baseRecommendations;
        }
        return baseRecommendations;
    }
    calculateSessionTagPreferences(recentInteractions) {
        const tagPreferences = {};
        for (const interaction of recentInteractions) {
            const tags = interaction.contentTags.split(',').map(t => t.trim().toLowerCase());
            for (const tag of tags) {
                if (!tagPreferences[tag]) {
                    tagPreferences[tag] = 0;
                }
                const timeWeight = this.calculateTimeWeight(interaction.timestamp);
                tagPreferences[tag] += interaction.engagement * timeWeight;
            }
        }
        const maxValue = Math.max(...Object.values(tagPreferences));
        if (maxValue > 0) {
            for (const tag in tagPreferences) {
                tagPreferences[tag] = tagPreferences[tag] / maxValue;
            }
        }
        return tagPreferences;
    }
    calculateTimeWeight(timestamp) {
        const now = new Date();
        const minutesDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60);
        if (minutesDiff < 5)
            return 1.0;
        if (minutesDiff < 15)
            return 0.8;
        if (minutesDiff < 30)
            return 0.6;
        if (minutesDiff < 60)
            return 0.4;
        return 0.2;
    }
    async notifyUserNewRecommendations(userId, contentType) {
        const room = `user-${userId}`;
        this.server.to(room).emit('new-recommendations-available', {
            contentType,
            message: 'New personalized recommendations are available',
            timestamp: new Date(),
        });
        this.logger.log(`Notified user ${userId} about new ${contentType} recommendations`);
    }
    async notifyUserProfileUpdated(userId) {
        const room = `user-${userId}`;
        this.server.to(room).emit('profile-updated', {
            message: 'Your learning profile has been updated based on recent activity',
            timestamp: new Date(),
        });
        this.logger.log(`Notified user ${userId} about profile update`);
    }
};
exports.RecommendationGateway = RecommendationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RecommendationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-recommendation-session'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RecommendationGateway.prototype, "handleJoinSession", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('track-session-interaction'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RecommendationGateway.prototype, "handleSessionInteraction", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get-session-recommendations'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], RecommendationGateway.prototype, "handleGetSessionRecommendations", null);
exports.RecommendationGateway = RecommendationGateway = RecommendationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    }),
    __metadata("design:paramtypes", [recommendation_service_1.RecommendationService])
], RecommendationGateway);
//# sourceMappingURL=recommendation.gateway.js.map