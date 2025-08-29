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
var BackgroundJobService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundJobService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const UserProfile_1 = require("../entities/UserProfile");
const UserRecommendation_1 = require("../entities/UserRecommendation");
const UserInteraction_1 = require("../entities/UserInteraction");
const recommendation_service_1 = require("./recommendation.service");
const schedule_1 = require("@nestjs/schedule");
let BackgroundJobService = BackgroundJobService_1 = class BackgroundJobService {
    constructor(userProfileRepository, userRecommendationRepository, userInteractionRepository, recommendationService) {
        this.userProfileRepository = userProfileRepository;
        this.userRecommendationRepository = userRecommendationRepository;
        this.userInteractionRepository = userInteractionRepository;
        this.recommendationService = recommendationService;
        this.logger = new common_1.Logger(BackgroundJobService_1.name);
    }
    async processInteractionsAndUpdateProfiles() {
        this.logger.log('Starting background job: Process interactions and update profiles');
        try {
            const usersWithInteractions = await this.getUsersWithRecentInteractions();
            for (const userId of usersWithInteractions) {
                await this.updateUserProfile(userId);
            }
            this.logger.log(`Updated profiles for ${usersWithInteractions.length} users`);
        }
        catch (error) {
            this.logger.error('Error in background job: Process interactions and update profiles', error);
        }
    }
    async generateRecommendations() {
        this.logger.log('Starting background job: Generate recommendations');
        try {
            const userProfiles = await this.userProfileRepository.find();
            for (const profile of userProfiles) {
                await this.generateUserRecommendations(profile.userId);
            }
            this.logger.log(`Generated recommendations for ${userProfiles.length} users`);
        }
        catch (error) {
            this.logger.error('Error in background job: Generate recommendations', error);
        }
    }
    async cleanupOldInteractions() {
        this.logger.log('Starting background job: Cleanup old interactions');
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 14);
            const result = await this.userInteractionRepository.delete({
                timestamp: { $lt: cutoffDate },
            });
            this.logger.log(`Cleaned up ${result.affected} old interaction records`);
        }
        catch (error) {
            this.logger.error('Error in background job: Cleanup old interactions', error);
        }
    }
    async getUsersWithRecentInteractions() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        const interactions = await this.userInteractionRepository
            .createQueryBuilder('interaction')
            .select('DISTINCT interaction.userId', 'userId')
            .where('interaction.timestamp >= :cutoffDate', { cutoffDate })
            .getRawMany();
        return interactions.map(i => i.userId);
    }
    async updateUserProfile(userId) {
        const recentInteractions = await this.userInteractionRepository.find({
            where: { userId },
            order: { timestamp: 'DESC' },
            take: 100,
        });
        if (recentInteractions.length === 0)
            return;
        const engagementMetrics = this.calculateEngagementMetrics(recentInteractions);
        const tagScores = await this.calculateTagScores(userId, recentInteractions);
        let userProfile = await this.userProfileRepository.findOne({ where: { userId } });
        if (!userProfile) {
            userProfile = this.userProfileRepository.create({
                userId,
                levelPreference: 'A1',
                ...tagScores,
                ...engagementMetrics,
                followedTeachersCount: 0,
                totalInteractions: recentInteractions.length,
            });
        }
        else {
            Object.assign(userProfile, tagScores, engagementMetrics);
            userProfile.totalInteractions = recentInteractions.length;
        }
        await this.userProfileRepository.save(userProfile);
    }
    calculateEngagementMetrics(interactions) {
        let totalWatchPercentage = 0;
        let totalScrollPercentage = 0;
        let watchCount = 0;
        let scrollCount = 0;
        for (const interaction of interactions) {
            if (interaction.watchPercentage !== null) {
                totalWatchPercentage += interaction.watchPercentage;
                watchCount++;
            }
            if (interaction.scrollPercentage !== null) {
                totalScrollPercentage += interaction.scrollPercentage;
                scrollCount++;
            }
        }
        return {
            averageWatchPercentage: watchCount > 0 ? totalWatchPercentage / watchCount : 50,
            averageScrollPercentage: scrollCount > 0 ? totalScrollPercentage / scrollCount : 50,
        };
    }
    async calculateTagScores(userId, interactions) {
        const tagScores = {};
        const allTags = [
            'grammarScore', 'vocabsScore', 'speakingScore', 'mirroringScore',
            'movieExplanationScore', 'ieltsScore', 'sportsScore', 'booksScore',
            'novelsScore', 'conversationScore', 'worksScore', 'cvScore',
            'medicalScore', 'engineerScore', 'economicScore', 'slangsScore',
            'interviewsScore', 'tradingScore', 'itScore'
        ];
        for (const tag of allTags) {
            tagScores[tag] = 0.5;
        }
        return tagScores;
    }
    async generateUserRecommendations(userId) {
        const userProfile = await this.userProfileRepository.findOne({ where: { userId } });
        if (!userProfile)
            return;
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 6);
        const recommendation = this.userRecommendationRepository.create({
            userId,
            contentId: 1,
            contentType: 'reel',
            score: 0.8,
            rank: 1,
            levelScore: 0.8,
            tagScore: 0.7,
            teacherScore: 0.9,
            engagementMultiplier: 1.1,
            recencyFactor: 1.0,
            contentLevel: userProfile.levelPreference,
            teacherId: 1,
            isTeacherFollowed: true,
            expiresAt,
        });
        await this.userRecommendationRepository.save(recommendation);
    }
    async manualProcessRecommendations(userId) {
        this.logger.log(`Manual processing recommendations for user ${userId}`);
        await this.updateUserProfile(userId);
        await this.generateUserRecommendations(userId);
    }
};
exports.BackgroundJobService = BackgroundJobService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_6_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackgroundJobService.prototype, "processInteractionsAndUpdateProfiles", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_6_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackgroundJobService.prototype, "generateRecommendations", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackgroundJobService.prototype, "cleanupOldInteractions", null);
exports.BackgroundJobService = BackgroundJobService = BackgroundJobService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(UserProfile_1.UserProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(UserRecommendation_1.UserRecommendation)),
    __param(2, (0, typeorm_1.InjectRepository)(UserInteraction_1.UserInteraction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        recommendation_service_1.RecommendationService])
], BackgroundJobService);
//# sourceMappingURL=background-job.service.js.map