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
exports.ReelCommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ReelComment_1 = require("./entity/ReelComment");
const users_service_1 = require("../users/users.service");
const reels_service_1 = require("../reels/reels.service");
const typeorm_2 = require("typeorm");
let ReelCommentService = class ReelCommentService {
    constructor(reelLikeRepo, userService, reelService) {
        this.reelLikeRepo = reelLikeRepo;
        this.userService = userService;
        this.reelService = reelService;
    }
    async createReel(reelId, id, data) {
        const user = await this.userService.findOneById(id);
        const reel = await this.reelService.findOneById(reelId);
        const reelLike = this.reelLikeRepo.create(data);
        reelLike.reel = reel;
        reelLike.student = user;
        return this.reelLikeRepo.save(reelLike);
    }
    find() {
        return this.reelLikeRepo.find({ relations: ['student'] });
    }
    findCommentForReel(id) {
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
            throw new common_1.NotFoundException('Teacher Not Found');
        return this.reelLikeRepo.remove(findReel);
    }
};
exports.ReelCommentService = ReelCommentService;
exports.ReelCommentService = ReelCommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ReelComment_1.ReelCommentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        reels_service_1.ReelsService])
], ReelCommentService);
//# sourceMappingURL=reel-comment.service.js.map