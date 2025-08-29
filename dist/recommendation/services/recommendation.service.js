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
exports.RecommendationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const UserProfile_1 = require("../entities/UserProfile");
const UserRecommendation_1 = require("../entities/UserRecommendation");
const UserInteraction_1 = require("../entities/UserInteraction");
const UserTagPreference_1 = require("../entities/UserTagPreference");
const tags_service_1 = require("../../tags/tags.service");
let RecommendationService = class RecommendationService {
    constructor(userProfileRepository, userRecommendationRepository, userInteractionRepository, userTagPreferenceRepository, tagsService) {
        this.userProfileRepository = userProfileRepository;
        this.userRecommendationRepository = userRecommendationRepository;
        this.userInteractionRepository = userInteractionRepository;
        this.userTagPreferenceRepository = userTagPreferenceRepository;
        this.tagsService = tagsService;
    }
    calculateContentScore(userProfile, contentLevel, teacherId, isTeacherFollowed, engagementMultiplier = 1.0, recencyFactor = 1.0) {
        const levelScore = this.calculateLevelScore(userProfile.levelPreference, contentLevel);
        const tagScore = 0.5;
        const teacherScore = isTeacherFollowed ? 1.0 : 0.3;
        const baseScore = (levelScore * 0.4) + (tagScore * 0.3) + (teacherScore * 0.3);
        const totalScore = baseScore * engagementMultiplier * recencyFactor;
        return {
            totalScore,
            levelScore,
            tagScore,
            teacherScore,
            engagementMultiplier,
            recencyFactor,
        };
    }
    calculateLevelScore(userLevel, contentLevel) {
        const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const userIndex = levels.indexOf(userLevel);
        const contentLevels = contentLevel.split(',').map(l => l.trim());
        if (userIndex === -1)
            return 0.5;
        let bestScore = 0;
        for (const level of contentLevels) {
            const contentIndex = levels.indexOf(level);
            if (contentIndex === -1)
                continue;
            const levelDiff = Math.abs(userIndex - contentIndex);
            let score = 1.0;
            if (levelDiff === 0)
                score = 1.0;
            else if (levelDiff === 1)
                score = 0.8;
            else if (levelDiff === 2)
                score = 0.6;
            else
                score = 0.3;
            bestScore = Math.max(bestScore, score);
        }
        return bestScore;
    }
    async calculateTagScore(userId, contentTags, userTypeId) {
        const tags = contentTags.split(',').map(t => t.trim().toLowerCase());
        if (tags.length === 0)
            return 0.5;
        let totalScore = 0;
        let tagCount = 0;
        for (const tagName of tags) {
            const tagPreference = await this.userTagPreferenceRepository.findOne({
                where: { userId, tagId: tagName },
            });
            let score = 0.5;
            if (tagPreference) {
                score = tagPreference.score;
            }
            totalScore += score;
            tagCount++;
        }
        return tagCount > 0 ? totalScore / tagCount : 0.5;
    }
    async calculateEngagementMultiplier(userId, contentType, contentTags) {
        const recentInteractions = await this.userInteractionRepository.find({
            where: { userId, contentType: contentType },
            order: { timestamp: 'DESC' },
            take: 50,
        });
        if (recentInteractions.length === 0)
            return 1.0;
        let totalEngagement = 0;
        let interactionCount = 0;
        for (const interaction of recentInteractions) {
            let engagement = 0.5;
            if (interaction.watchPercentage) {
                engagement = interaction.watchPercentage / 100;
            }
            else if (interaction.scrollPercentage) {
                engagement = interaction.scrollPercentage / 100;
            }
            if (interaction.liked)
                engagement += 0.2;
            if (interaction.commented)
                engagement += 0.3;
            if (interaction.saved)
                engagement += 0.2;
            if (interaction.shared)
                engagement += 0.1;
            totalEngagement += Math.min(engagement, 1.0);
            interactionCount++;
        }
        const averageEngagement = totalEngagement / interactionCount;
        return 0.8 + (averageEngagement * 0.4);
    }
    calculateRecencyFactor(createdAt) {
        const now = new Date();
        const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        if (hoursDiff < 1)
            return 1.2;
        if (hoursDiff < 6)
            return 1.1;
        if (hoursDiff < 24)
            return 1.0;
        if (hoursDiff < 72)
            return 0.9;
        return 0.8;
    }
    async getRecommendations(userId, contentType, limit = 20) {
        const recommendations = await this.userRecommendationRepository.find({
            where: { userId, contentType },
            order: { score: 'DESC' },
            take: limit,
        });
        return recommendations;
    }
    async areRecommendationsFresh(userId, contentType) {
        const latestRecommendation = await this.userRecommendationRepository.findOne({
            where: { userId, contentType: contentType },
            order: { cachedAt: 'DESC' },
        });
        if (!latestRecommendation)
            return false;
        const now = new Date();
        const hoursSinceCache = (now.getTime() - latestRecommendation.cachedAt.getTime()) / (1000 * 60 * 60);
        return hoursSinceCache < 6;
    }
    async updateUserTagPreferences(userId, contentTags, engagement) {
        const tags = contentTags.split(',').map(t => t.trim().toLowerCase());
        for (const tagName of tags) {
            let tagPreference = await this.userTagPreferenceRepository.findOne({
                where: { userId, tagId: tagName },
            });
            if (!tagPreference) {
                tagPreference = this.userTagPreferenceRepository.create({
                    userId,
                    tagId: tagName,
                    score: 0.5,
                    interactionCount: 0,
                });
            }
            const currentScore = tagPreference.score;
            const newScore = (currentScore + engagement) / 2;
            tagPreference.score = Math.max(0.0, Math.min(1.0, newScore));
            tagPreference.interactionCount += 1;
            await this.userTagPreferenceRepository.save(tagPreference);
        }
    }
};
exports.RecommendationService = RecommendationService;
exports.RecommendationService = RecommendationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(UserProfile_1.UserProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(UserRecommendation_1.UserRecommendation)),
    __param(2, (0, typeorm_1.InjectRepository)(UserInteraction_1.UserInteraction)),
    __param(3, (0, typeorm_1.InjectRepository)(UserTagPreference_1.UserTagPreference)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        tags_service_1.TagsService])
], RecommendationService);
//# sourceMappingURL=recommendation.service.js.map