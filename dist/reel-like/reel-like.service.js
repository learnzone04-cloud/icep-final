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
exports.ReelLikeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ReelLike_1 = require("./entity/ReelLike");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const reels_service_1 = require("../reels/reels.service");
let ReelLikeService = class ReelLikeService {
    constructor(reelLikeRepo, userService, reelService) {
        this.reelLikeRepo = reelLikeRepo;
        this.userService = userService;
        this.reelService = reelService;
    }
    async toggleReelLike(reelId, userId) {
        const user = await this.userService.findOneById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const reel = await this.reelService.findOneById(reelId);
        if (!reel) {
            throw new common_1.NotFoundException('Reel not found');
        }
        const existingLike = await this.reelLikeRepo.findOne({
            where: { reelId, studentId: userId.toString() }
        });
        if (existingLike) {
            await this.reelLikeRepo.remove(existingLike);
            return {
                action: 'unliked',
                message: 'Reel unliked successfully',
                isLiked: false,
                likeCount: await this.getReelLikeCount(reelId)
            };
        }
        else {
            const newLike = this.reelLikeRepo.create({
                reelId,
                studentId: userId.toString()
            });
            await this.reelLikeRepo.save(newLike);
            return {
                action: 'liked',
                message: 'Reel liked successfully',
                isLiked: true,
                likeCount: await this.getReelLikeCount(reelId)
            };
        }
    }
    async getReelLikeCount(reelId) {
        return this.reelLikeRepo.count({
            where: { reelId }
        });
    }
    async checkUserLikeStatus(reelId, userId) {
        const like = await this.reelLikeRepo.findOne({
            where: { reelId, studentId: userId.toString() }
        });
        return !!like;
    }
    find() {
        return this.reelLikeRepo.find({ relations: ['student'] });
    }
    findLikeForReel(id) {
        return this.reelLikeRepo.find({
            where: { reelId: id },
            relations: ['student'],
        });
    }
    findOneById(id) {
        return this.reelLikeRepo.findOne({
            where: { id: id },
        });
    }
    async delete(id) {
        const findReel = await this.findOneById(id);
        if (!findReel)
            throw new common_1.NotFoundException('Reel Like Not Found');
        return this.reelLikeRepo.remove(findReel);
    }
};
exports.ReelLikeService = ReelLikeService;
exports.ReelLikeService = ReelLikeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ReelLike_1.ReelLikeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        reels_service_1.ReelsService])
], ReelLikeService);
//# sourceMappingURL=reel-like.service.js.map