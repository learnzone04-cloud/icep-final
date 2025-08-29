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
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Article_1 = require("./entity/Article");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const notification_service_1 = require("../notification/notification.service");
const recommendation_service_1 = require("../recommendation/services/recommendation.service");
let ArticleService = class ArticleService {
    constructor(articleRepo, userService, notificationService, recommendationService) {
        this.articleRepo = articleRepo;
        this.userService = userService;
        this.notificationService = notificationService;
        this.recommendationService = recommendationService;
    }
    async createArticle(id, data) {
        const user = await this.userService.findOneById(id);
        if (!user.teacher) {
            throw new common_1.NotFoundException('Only teachers can create articles');
        }
        if (!user.teacher.type) {
            throw new common_1.NotFoundException('Teacher must have a type assigned');
        }
        const article = this.articleRepo.create(data);
        article.type = user.teacher.type;
        article.user = user;
        const savedArticle = await this.articleRepo.save(article);
        try {
            const teacherName = `${user.fName} ${user.lName}`;
            await this.notificationService.sendArticleCreatedNotification(user.teacher.id, teacherName, savedArticle.id, savedArticle.article);
        }
        catch (error) {
            console.error('Failed to send article notification:', error);
        }
        return savedArticle;
    }
    find() {
        return this.articleRepo.find({
            relations: [
                'user',
                'articleLikes',
                'articleLikes.student',
                'articleComments',
                'articleComments.student',
                'articleReads',
                'articleReads.student',
            ],
        });
    }
    async findByUserType(user) {
        console.log('User from JWT:', user);
        console.log('User role:', user.role);
        console.log('User typeId:', user.typeId);
        if (user.role === 'Student' && user.typeId) {
            console.log('Filtering for student with typeId:', user.typeId);
            const articles = await this.articleRepo.find({
                where: { typeId: user.typeId },
                relations: [
                    'user',
                    'articleLikes',
                    'articleLikes.student',
                    'articleComments',
                    'articleComments.student',
                    'articleReads',
                    'articleReads.student',
                ],
            });
            console.log('Found articles:', articles.map(a => ({ id: a.id, typeId: a.typeId })));
            return articles;
        }
        if (user.role === 'Teacher') {
            console.log('Filtering for teacher with userId:', user.id);
            const articles = await this.articleRepo.find({
                where: { userId: user.id },
                relations: [
                    'user',
                    'articleLikes',
                    'articleLikes.student',
                    'articleComments',
                    'articleComments.student',
                    'articleReads',
                    'articleReads.student',
                ],
            });
            console.log('Found teacher articles:', articles.map(a => ({ id: a.id, userId: a.userId })));
            return articles;
        }
        console.log('No valid role found, returning empty array');
        return [];
    }
    async findArticlesWithRecommendations(userId, userTypeId) {
        const user = await this.userService.findOneById(userId);
        if (!user || user.role !== 'Student') {
            throw new common_1.NotFoundException('Student not found');
        }
        if (!userTypeId) {
            throw new common_1.NotFoundException('User type ID is required');
        }
        const typeId = userTypeId;
        const articles = await this.articleRepo.find({
            where: { typeId: typeId },
            relations: [
                'user',
                'articleLikes',
                'articleLikes.student',
                'articleComments',
                'articleComments.student',
                'articleReads',
                'articleReads.student',
            ],
        });
        const recommendations = await this.recommendationService.getRecommendations(userId, 'article', 1000);
        const recommendationMap = new Map();
        recommendations.forEach(rec => {
            recommendationMap.set(rec.contentId, rec.score);
        });
        const articlesWithScores = articles.map(article => {
            const recommendationScore = recommendationMap.get(article.id) || 0.5;
            return {
                id: article.id,
                article: article.article,
                level: article.level,
                tags: article.tags,
                userId: article.userId,
                typeId: article.typeId,
                createdAt: article.createdAt,
                user: article.user,
                articleLikes: article.articleLikes,
                articleComments: article.articleComments,
                articleReads: article.articleReads,
                recommendationScore: recommendationScore,
                rank: recommendationMap.has(article.id) ? recommendations.find(r => r.contentId === article.id)?.rank || 999 : 999,
            };
        });
        articlesWithScores.sort((a, b) => {
            if (b.recommendationScore !== a.recommendationScore) {
                return b.recommendationScore - a.recommendationScore;
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        return articlesWithScores;
    }
    findOneById(id) {
        return this.articleRepo.findOne({
            where: { id: id },
        });
    }
    async delete(id) {
        const findArticle = await this.findOneById(id);
        if (!findArticle)
            throw new common_1.NotFoundException('Article Not Found');
        return this.articleRepo.remove(findArticle);
    }
    async update(id, data) {
        const article = await this.findOneById(id);
        if (!article)
            throw new common_1.NotFoundException('Article Not Found');
        Object.assign(article, data);
        return this.articleRepo.save(article);
    }
};
exports.ArticleService = ArticleService;
exports.ArticleService = ArticleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Article_1.ArticleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        notification_service_1.NotificationService,
        recommendation_service_1.RecommendationService])
], ArticleService);
//# sourceMappingURL=article.service.js.map