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
exports.ReelCommentController = void 0;
const common_1 = require("@nestjs/common");
const reel_comment_service_1 = require("./reel-comment.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ReelCommentController = class ReelCommentController {
    constructor(service) {
        this.service = service;
    }
    likeReel(req, id, body) {
        return this.service.createReel(id, req.user.id, body);
    }
    getReelComment(id) {
        return this.service.findCommentForReel(id);
    }
    deleteLike(id) {
        return this.service.delete(id);
    }
};
exports.ReelCommentController = ReelCommentController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Object)
], ReelCommentController.prototype, "likeReel", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReelCommentController.prototype, "getReelComment", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReelCommentController.prototype, "deleteLike", null);
exports.ReelCommentController = ReelCommentController = __decorate([
    (0, common_1.Controller)('reel-comment'),
    __metadata("design:paramtypes", [reel_comment_service_1.ReelCommentService])
], ReelCommentController);
//# sourceMappingURL=reel-comment.controller.js.map