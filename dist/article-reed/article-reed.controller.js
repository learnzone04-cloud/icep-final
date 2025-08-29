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
exports.ArticleReedController = void 0;
const common_1 = require("@nestjs/common");
const article_reed_service_1 = require("./article-reed.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ArticleReedController = class ArticleReedController {
    constructor(service) {
        this.service = service;
    }
    readArticle(req, id) {
        return this.service.createArticleRead({ articleId: id, id: req.user.id });
    }
    getArticleReadOne(id) {
        return this.service.findArticleReed(id);
    }
    getArticleReads() {
        return this.service.find();
    }
    deleteLike(id) {
        return this.service.delete(id);
    }
};
exports.ArticleReedController = ArticleReedController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Object)
], ArticleReedController.prototype, "readArticle", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ArticleReedController.prototype, "getArticleReadOne", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticleReedController.prototype, "getArticleReads", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ArticleReedController.prototype, "deleteLike", null);
exports.ArticleReedController = ArticleReedController = __decorate([
    (0, common_1.Controller)('article-read'),
    __metadata("design:paramtypes", [article_reed_service_1.ArticleReedService])
], ArticleReedController);
//# sourceMappingURL=article-reed.controller.js.map