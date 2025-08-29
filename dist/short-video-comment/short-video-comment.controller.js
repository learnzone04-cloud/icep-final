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
exports.ShortVideoCommentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const short_video_comment_service_1 = require("./short-video-comment.service");
const create_short_video_comment_dto_1 = require("./dtos/create-short-video-comment.dto");
let ShortVideoCommentController = class ShortVideoCommentController {
    constructor(shortVideoCommentService) {
        this.shortVideoCommentService = shortVideoCommentService;
    }
    createShortVideoComment(shortVideoId, req, createShortVideoCommentDto) {
        return this.shortVideoCommentService.createShortVideoComment(shortVideoId, req.user.id, { content: createShortVideoCommentDto.content });
    }
    getShortVideoComments() {
        return this.shortVideoCommentService.find();
    }
    getCommentsForShortVideo(shortVideoId) {
        return this.shortVideoCommentService.findCommentForShortVideo(shortVideoId);
    }
    deleteShortVideoComment(id, req) {
        return this.shortVideoCommentService.delete(id, req.user);
    }
};
exports.ShortVideoCommentController = ShortVideoCommentController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/:shortVideoId'),
    __param(0, (0, common_1.Param)('shortVideoId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, create_short_video_comment_dto_1.CreateShortVideoCommentDto]),
    __metadata("design:returntype", void 0)
], ShortVideoCommentController.prototype, "createShortVideoComment", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShortVideoCommentController.prototype, "getShortVideoComments", null);
__decorate([
    (0, common_1.Get)('/:shortVideoId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('shortVideoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ShortVideoCommentController.prototype, "getCommentsForShortVideo", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ShortVideoCommentController.prototype, "deleteShortVideoComment", null);
exports.ShortVideoCommentController = ShortVideoCommentController = __decorate([
    (0, common_1.Controller)('short-video-comments'),
    __metadata("design:paramtypes", [short_video_comment_service_1.ShortVideoCommentService])
], ShortVideoCommentController);
//# sourceMappingURL=short-video-comment.controller.js.map