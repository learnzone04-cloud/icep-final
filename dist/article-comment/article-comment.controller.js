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
exports.ArticleCommentController = void 0;
const common_1 = require("@nestjs/common");
const article_comment_service_1 = require("./article-comment.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ArticleCommentController = class ArticleCommentController {
    constructor(service) {
        this.service = service;
    }
    commentArticle(req, id, body) {
        return this.service.createArticleComment(id, req.user.id, body);
    }
    getArticleComments() {
        return this.service.find();
    }
    getArtcleOneLike(id) {
        return this.service.findArticleOneComment(id);
    }
    deleteLike(id) {
        return this.service.delete(id);
    }
};
exports.ArticleCommentController = ArticleCommentController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Object)
], ArticleCommentController.prototype, "commentArticle", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticleCommentController.prototype, "getArticleComments", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ArticleCommentController.prototype, "getArtcleOneLike", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ArticleCommentController.prototype, "deleteLike", null);
exports.ArticleCommentController = ArticleCommentController = __decorate([
    (0, common_1.Controller)('article-comment'),
    __metadata("design:paramtypes", [article_comment_service_1.ArticleCommentService])
], ArticleCommentController);
//# sourceMappingURL=article-comment.controller.js.map