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
exports.ShortVideoLikeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ShortVideoLike_1 = require("./entity/ShortVideoLike");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const short_video_service_1 = require("../short-video/short-video.service");
let ShortVideoLikeService = class ShortVideoLikeService {
    constructor(shortVideoLikeRepo, userService, shortVideoService) {
        this.shortVideoLikeRepo = shortVideoLikeRepo;
        this.userService = userService;
        this.shortVideoService = shortVideoService;
    }
    async toggleShortVideoLike(shortVideoId, studentId) {
        const user = await this.userService.findOneById(studentId);
        const shortVideo = await this.shortVideoService.findOneById(shortVideoId);
        if (!shortVideo) {
            throw new common_1.NotFoundException('Short Video Not Found');
        }
        const existingLike = await this.shortVideoLikeRepo.findOne({
            where: {
                shortVideoId: shortVideoId,
                studentId: studentId.toString()
            }
        });
        if (existingLike) {
            await this.shortVideoLikeRepo.remove(existingLike);
            return {
                action: 'unliked',
                message: 'Short video unliked successfully',
                isLiked: false,
                likeCount: await this.getShortVideoLikeCount(shortVideoId)
            };
        }
        else {
            const shortVideoLike = this.shortVideoLikeRepo.create({
                shortVideoId,
                studentId: studentId.toString()
            });
            await this.shortVideoLikeRepo.save(shortVideoLike);
            return {
                action: 'liked',
                message: 'Short video liked successfully',
                isLiked: true,
                likeCount: await this.getShortVideoLikeCount(shortVideoId)
            };
        }
    }
    async getShortVideoLikeCount(shortVideoId) {
        return this.shortVideoLikeRepo.count({
            where: { shortVideoId }
        });
    }
    async checkUserLikeStatus(shortVideoId, studentId) {
        const like = await this.shortVideoLikeRepo.findOne({
            where: { shortVideoId, studentId: studentId.toString() }
        });
        return !!like;
    }
    find() {
        return this.shortVideoLikeRepo.find({ relations: ['student'] });
    }
    findLikeForShortVideo(id) {
        return this.shortVideoLikeRepo.find({
            where: { shortVideoId: id },
            relations: ['student'],
        });
    }
    findOneById(id) {
        return this.shortVideoLikeRepo.findOne({
            where: { id: id },
        });
    }
    async checkUserLike(shortVideoId, studentId) {
        const existingLike = await this.shortVideoLikeRepo.findOne({
            where: {
                shortVideoId: shortVideoId,
                studentId: studentId.toString()
            }
        });
        return {
            isLiked: !!existingLike,
            likeId: existingLike?.id || null
        };
    }
    async delete(id) {
        const findShortVideoLike = await this.findOneById(id);
        if (!findShortVideoLike)
            throw new common_1.NotFoundException('Short Video Like Not Found');
        return this.shortVideoLikeRepo.remove(findShortVideoLike);
    }
};
exports.ShortVideoLikeService = ShortVideoLikeService;
exports.ShortVideoLikeService = ShortVideoLikeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ShortVideoLike_1.ShortVideoLikeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        short_video_service_1.ShortVideoService])
], ShortVideoLikeService);
//# sourceMappingURL=short-video-like.service.js.map