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
exports.ArticleCommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ArticleComment_1 = require("./entity/ArticleComment");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const article_service_1 = require("../article/article.service");
let ArticleCommentService = class ArticleCommentService {
    constructor(articleCommentRepo, userService, service) {
        this.articleCommentRepo = articleCommentRepo;
        this.userService = userService;
        this.service = service;
    }
    async createArticleComment(articleId, id, data) {
        const user = await this.userService.findOneById(id);
        const article = await this.service.findOneById(articleId);
        const articleComment = this.articleCommentRepo.create(data);
        articleComment.article = article;
        articleComment.student = user;
        return this.articleCommentRepo.save(articleComment);
    }
    find() {
        return this.articleCommentRepo.find({ relations: ['student'] });
    }
    findArticleOneComment(id) {
        return this.articleCommentRepo.find({
            where: { articleId: id },
            relations: ['student'],
        });
    }
    findOneById(id) {
        return this.articleCommentRepo.findOne({
            where: { id: id },
        });
    }
    async delete(id) {
        const findArticleComment = await this.findOneById(id);
        if (!findArticleComment)
            throw new common_1.NotFoundException('Article Comment Not Found');
        return this.articleCommentRepo.remove(findArticleComment);
    }
};
exports.ArticleCommentService = ArticleCommentService;
exports.ArticleCommentService = ArticleCommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ArticleComment_1.ArticleComment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        article_service_1.ArticleService])
], ArticleCommentService);
//# sourceMappingURL=article-comment.service.js.map