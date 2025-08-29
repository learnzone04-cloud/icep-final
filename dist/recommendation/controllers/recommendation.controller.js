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
var RecommendationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationController = void 0;
const common_1 = require("@nestjs/common");
const recommendation_service_1 = require("../services/recommendation.service");
const event_tracking_service_1 = require("../services/event-tracking.service");
const background_job_service_1 = require("../services/background-job.service");
const track_event_dto_1 = require("../dtos/track-event.dto");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let RecommendationController = RecommendationController_1 = class RecommendationController {
    constructor(recommendationService, eventTrackingService, backgroundJobService) {
        this.recommendationService = recommendationService;
        this.eventTrackingService = eventTrackingService;
        this.backgroundJobService = backgroundJobService;
        this.logger = new common_1.Logger(RecommendationController_1.name);
    }
    async healthCheck() {
        return {
            status: 'healthy',
            timestamp: new Date(),
        };
    }
    async getRecommendations(contentType, limit = 20, req) {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        this.logger.log(`Getting recommendations for user ${userId}, content type: ${contentType}`);
        try {
            const areFresh = await this.recommendationService.areRecommendationsFresh(userId, contentType);
            if (!areFresh) {
                this.logger.log(`Recommendations stale for user ${userId}, triggering background update`);
                this.backgroundJobService.manualProcessRecommendations(userId).catch(error => {
                    this.logger.error(`Error in background update for user ${userId}`, error);
                });
            }
            const recommendations = await this.recommendationService.getRecommendations(userId, contentType, limit);
            const recommendationResponses = recommendations.map(rec => ({
                contentId: rec.contentId,
                contentType: rec.contentType,
                score: rec.score,
                rank: rec.rank,
                levelScore: rec.levelScore,
                tagScore: rec.tagScore,
                teacherScore: rec.teacherScore,
                engagementMultiplier: rec.engagementMultiplier,
                recencyFactor: rec.recencyFactor,
                contentLevel: rec.contentLevel,
                teacherId: rec.teacherId,
                isTeacherFollowed: rec.isTeacherFollowed,
                cachedAt: rec.cachedAt,
                expiresAt: rec.expiresAt,
            }));
            const response = {
                userId,
                contentType,
                recommendations: recommendationResponses,
                totalCount: recommendationResponses.length,
                cacheStatus: areFresh ? 'fresh' : 'stale',
                generatedAt: new Date(),
            };
            this.logger.log(`Returning ${recommendationResponses.length} recommendations for user ${userId}`);
            return response;
        }
        catch (error) {
            this.logger.error(`Error getting recommendations for user ${userId}`, error);
            throw error;
        }
    }
    async trackEvent(trackEventDto, req) {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        this.logger.log(`Tracking event for user ${userId}, content ${trackEventDto.contentId}`);
        try {
            const eventWithUserId = { ...trackEventDto, userId };
            await this.eventTrackingService.trackEvent(eventWithUserId);
            this.logger.log(`Successfully tracked event for user ${userId}`);
            return {
                success: true,
                message: 'Event tracked successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error tracking event for user ${userId}`, error);
            throw error;
        }
    }
    async manualProcessRecommendations(req) {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        this.logger.log(`Manual processing recommendations for user ${userId}`);
        try {
            await this.backgroundJobService.manualProcessRecommendations(userId);
            this.logger.log(`Successfully processed recommendations for user ${userId}`);
            return {
                success: true,
                message: 'Recommendations processed successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error processing recommendations for user ${userId}`, error);
            throw error;
        }
    }
};
exports.RecommendationController = RecommendationController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecommendationController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)(':contentType'),
    __param(0, (0, common_1.Param)('contentType')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], RecommendationController.prototype, "getRecommendations", null);
__decorate([
    (0, common_1.Post)('track-event'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_event_dto_1.TrackEventDto, Object]),
    __metadata("design:returntype", Promise)
], RecommendationController.prototype, "trackEvent", null);
__decorate([
    (0, common_1.Post)('process-recommendations'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecommendationController.prototype, "manualProcessRecommendations", null);
exports.RecommendationController = RecommendationController = RecommendationController_1 = __decorate([
    (0, common_1.Controller)('recommendations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [recommendation_service_1.RecommendationService,
        event_tracking_service_1.EventTrackingService,
        background_job_service_1.BackgroundJobService])
], RecommendationController);
//# sourceMappingURL=recommendation.controller.js.map