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
exports.FollowerController = void 0;
const common_1 = require("@nestjs/common");
const follower_service_1 = require("./follower.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let FollowerController = class FollowerController {
    constructor(followerService) {
        this.followerService = followerService;
    }
    create(req, teacherId) {
        return this.followerService.create(req.user.id, teacherId);
    }
    findMyFollowers(req) {
        return this.followerService.findMyFollowers(req.user);
    }
    unfollowTeacher(req, teacherId) {
        return this.followerService.unfollowTeacher(req.user, teacherId);
    }
    removeFollower(req, studentId) {
        return this.followerService.removeFollower(req.user, studentId);
    }
    toggleFollow(req, teacherId) {
        return this.followerService.toggleFollow(req.user.id, teacherId);
    }
};
exports.FollowerController = FollowerController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/:teacherId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('teacherId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], FollowerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FollowerController.prototype, "findMyFollowers", null);
__decorate([
    (0, common_1.Delete)('/:teacherId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('teacherId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], FollowerController.prototype, "unfollowTeacher", null);
__decorate([
    (0, common_1.Delete)('/removefollower/:studentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], FollowerController.prototype, "removeFollower", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/toggle/:teacherId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('teacherId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], FollowerController.prototype, "toggleFollow", null);
exports.FollowerController = FollowerController = __decorate([
    (0, common_1.Controller)('follow'),
    __metadata("design:paramtypes", [follower_service_1.FollowerService])
], FollowerController);
//# sourceMappingURL=follower.controller.js.map