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
exports.ArticleReedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ArticleReed_1 = require("./entity/ArticleReed");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const article_service_1 = require("../article/article.service");
let ArticleReedService = class ArticleReedService {
    constructor(articleReadRepo, userService, service) {
        this.articleReadRepo = articleReadRepo;
        this.userService = userService;
        this.service = service;
    }
    async createArticleRead(data) {
        const user = await this.userService.findOneById(data.id);
        const article = await this.service.findOneById(data.articleId);
        const articleRead = this.articleReadRepo.create(data);
        articleRead.article = article;
        articleRead.student = user;
        return this.articleReadRepo.save(articleRead);
    }
    findArticleReed(id) {
        return this.articleReadRepo.find({
            where: { articleId: id },
            relations: ['student'],
        });
    }
    find() {
        return this.articleReadRepo.find({ relations: ['student'] });
    }
    findOneById(id) {
        return this.articleReadRepo.findOne({
            where: { id: id },
        });
    }
    async delete(id) {
        const findArticleRead = await this.findOneById(id);
        if (!findArticleRead)
            throw new common_1.NotFoundException('Article Read Not Found');
        return this.articleReadRepo.remove(findArticleRead);
    }
};
exports.ArticleReedService = ArticleReedService;
exports.ArticleReedService = ArticleReedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ArticleReed_1.ArticleRead)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        article_service_1.ArticleService])
], ArticleReedService);
//# sourceMappingURL=article-reed.service.js.map