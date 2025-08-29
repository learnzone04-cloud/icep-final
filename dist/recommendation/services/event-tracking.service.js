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
exports.EventTrackingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const UserInteraction_1 = require("../entities/UserInteraction");
let EventTrackingService = class EventTrackingService {
    constructor(userInteractionRepository) {
        this.userInteractionRepository = userInteractionRepository;
    }
    async trackEvent(trackEventDto) {
        let watchPercentage = trackEventDto.watchPercentage;
        if (trackEventDto.watchTime && trackEventDto.totalTime) {
            watchPercentage = (trackEventDto.watchTime / trackEventDto.totalTime) * 100;
        }
        const interaction = this.userInteractionRepository.create({
            userId: trackEventDto.userId,
            contentId: trackEventDto.contentId,
            contentType: trackEventDto.contentType,
            watchTime: trackEventDto.watchTime,
            totalTime: trackEventDto.totalTime,
            watchPercentage,
            scrollPercentage: trackEventDto.scrollPercentage,
            liked: trackEventDto.liked || false,
            commented: trackEventDto.commented || false,
            followed: trackEventDto.followed || false,
            shared: trackEventDto.shared || false,
            saved: trackEventDto.saved || false,
            timestamp: new Date(),
        });
        await this.userInteractionRepository.save(interaction);
    }
    async getUserInteractions(userId, days = 14) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return this.userInteractionRepository.find({
            where: {
                userId,
                timestamp: { $gte: cutoffDate },
            },
            order: { timestamp: 'DESC' },
        });
    }
    async getInteractionsByContentType(userId, contentType, days = 14) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return this.userInteractionRepository.find({
            where: {
                userId,
                contentType: contentType,
                timestamp: { $gte: cutoffDate },
            },
            order: { timestamp: 'DESC' },
        });
    }
};
exports.EventTrackingService = EventTrackingService;
exports.EventTrackingService = EventTrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(UserInteraction_1.UserInteraction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EventTrackingService);
//# sourceMappingURL=event-tracking.service.js.map