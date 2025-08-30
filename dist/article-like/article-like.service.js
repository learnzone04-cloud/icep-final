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
exports.ArticleLikeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ArticleLike_1 = require("./entity/ArticleLike");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const article_service_1 = require("../article/article.service");
let ArticleLikeService = class ArticleLikeService {
    constructor(articleLikeRepo, userService, articleService) {
        this.articleLikeRepo = articleLikeRepo;
        this.userService = userService;
        this.articleService = articleService;
    }
    async toggleArticleLike(articleId, userId) {
        const user = await this.userService.findOneById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const article = await this.articleService.findOneById(articleId);
        if (!article) {
            throw new common_1.NotFoundException('Article not found');
        }
        const existingLike = await this.articleLikeRepo.findOne({
            where: { articleId, studentId: userId }
        });
        if (existingLike) {
            await this.articleLikeRepo.remove(existingLike);
            return {
                action: 'unliked',
                message: 'Article unliked successfully',
                isLiked: false,
                likeCount: await this.getArticleLikeCount(articleId)
            };
        }
        else {
            const newLike = this.articleLikeRepo.create({
                articleId,
                studentId: userId,
                isLiked: true
            });
            await this.articleLikeRepo.save(newLike);
            return {
                action: 'liked',
                message: 'Article liked successfully',
                isLiked: true,
                likeCount: await this.getArticleLikeCount(articleId)
            };
        }
    }
    async getArticleLikeCount(articleId) {
        return this.articleLikeRepo.count({
            where: { articleId }
        });
    }
    async checkUserLikeStatus(articleId, userId) {
        const like = await this.articleLikeRepo.findOne({
            where: { articleId, studentId: userId }
        });
        return !!like;
    }
    find() {
        return this.articleLikeRepo.find({ relations: ['student'] });
    }
    findArticleOneLike(id) {
        return this.articleLikeRepo.find({
            where: { articleId: id },
            relations: ['student'],
        });
    }
    findOneById(id) {
        return this.articleLikeRepo.findOne({
            where: { id: id },
        });
    }
    async delete(id) {
        const findArticleLike = await this.findOneById(id);
        if (!findArticleLike)
            throw new common_1.NotFoundException('Article Like Not Found');
        return this.articleLikeRepo.remove(findArticleLike);
    }
};
exports.ArticleLikeService = ArticleLikeService;
exports.ArticleLikeService = ArticleLikeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ArticleLike_1.ArticleLike)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        article_service_1.ArticleService])
], ArticleLikeService);
//# sourceMappingURL=article-like.service.js.map