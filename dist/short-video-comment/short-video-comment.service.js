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
exports.ShortVideoCommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ShortVideoComment_1 = require("./entity/ShortVideoComment");
const users_service_1 = require("../users/users.service");
const short_video_service_1 = require("../short-video/short-video.service");
const typeorm_2 = require("typeorm");
let ShortVideoCommentService = class ShortVideoCommentService {
    constructor(shortVideoCommentRepo, userService, shortVideoService) {
        this.shortVideoCommentRepo = shortVideoCommentRepo;
        this.userService = userService;
        this.shortVideoService = shortVideoService;
    }
    async createShortVideoComment(shortVideoId, id, data) {
        const user = await this.userService.findOneById(id);
        const shortVideo = await this.shortVideoService.findOneById(shortVideoId);
        const shortVideoComment = this.shortVideoCommentRepo.create(data);
        shortVideoComment.shortVideo = shortVideo;
        shortVideoComment.student = user;
        return this.shortVideoCommentRepo.save(shortVideoComment);
    }
    find() {
        return this.shortVideoCommentRepo.find({ relations: ['student'] });
    }
    findCommentForShortVideo(id) {
        return this.shortVideoCommentRepo.find({
            where: { shortVideoId: id },
            relations: ['student'],
        });
    }
    findOneById(id) {
        return this.shortVideoCommentRepo.findOne({
            where: { id: id },
        });
    }
    async delete(id, user) {
        const findShortVideoComment = await this.findOneById(id);
        if (!findShortVideoComment)
            throw new common_1.NotFoundException('Short Video Comment Not Found');
        const shortVideo = await this.shortVideoService.findOneById(findShortVideoComment.shortVideoId);
        if (!shortVideo)
            throw new common_1.NotFoundException('Short Video Not Found');
        const isCommentOwner = findShortVideoComment.studentId === user.id;
        const isShortVideoOwner = shortVideo.teacherId === user.id;
        if (!isCommentOwner && !isShortVideoOwner) {
            throw new common_1.ForbiddenException('You are not allowed to delete this comment');
        }
        return this.shortVideoCommentRepo.remove(findShortVideoComment);
    }
};
exports.ShortVideoCommentService = ShortVideoCommentService;
exports.ShortVideoCommentService = ShortVideoCommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ShortVideoComment_1.ShortVideoCommentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        short_video_service_1.ShortVideoService])
], ShortVideoCommentService);
//# sourceMappingURL=short-video-comment.service.js.map