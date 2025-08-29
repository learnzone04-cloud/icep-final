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
exports.SavedArticleController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const saved_article_service_1 = require("./saved-article.service");
const save_article_dto_1 = require("./dto/save-article.dto");
let SavedArticleController = class SavedArticleController {
    constructor(savedArticleService) {
        this.savedArticleService = savedArticleService;
    }
    async saveArticle(saveArticleDto, req) {
        const userId = req.user.id;
        return this.savedArticleService.saveArticle(userId, saveArticleDto);
    }
    async unsaveArticle(articleId, req) {
        const userId = req.user.id;
        return this.savedArticleService.unsaveArticle(userId, articleId);
    }
    async getSavedArticles(req) {
        const userId = req.user.id;
        return this.savedArticleService.getSavedArticles(userId);
    }
    async isArticleSaved(articleId, req) {
        const userId = req.user.id;
        return this.savedArticleService.isArticleSaved(userId, articleId);
    }
};
exports.SavedArticleController = SavedArticleController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_article_dto_1.SaveArticleDto, Object]),
    __metadata("design:returntype", Promise)
], SavedArticleController.prototype, "saveArticle", null);
__decorate([
    (0, common_1.Delete)(':articleId'),
    __param(0, (0, common_1.Param)('articleId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SavedArticleController.prototype, "unsaveArticle", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SavedArticleController.prototype, "getSavedArticles", null);
__decorate([
    (0, common_1.Get)('check/:articleId'),
    __param(0, (0, common_1.Param)('articleId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SavedArticleController.prototype, "isArticleSaved", null);
exports.SavedArticleController = SavedArticleController = __decorate([
    (0, common_1.Controller)('saved-articles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [saved_article_service_1.SavedArticleService])
], SavedArticleController);
//# sourceMappingURL=saved-article.controller.js.map