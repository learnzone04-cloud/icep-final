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
exports.SavedArticleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const SavedArticle_1 = require("./entity/SavedArticle");
const Student_1 = require("../student/entity/Student");
const Article_1 = require("../article/entity/Article");
let SavedArticleService = class SavedArticleService {
    constructor(savedArticleRepo, studentRepo, articleRepo) {
        this.savedArticleRepo = savedArticleRepo;
        this.studentRepo = studentRepo;
        this.articleRepo = articleRepo;
    }
    async saveArticle(userId, saveArticleDto) {
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student) {
            throw new common_1.BadRequestException('Student not found');
        }
        const article = await this.articleRepo.findOne({ where: { id: saveArticleDto.articleId } });
        if (!article) {
            throw new common_1.NotFoundException('Article not found');
        }
        const existing = await this.savedArticleRepo.findOne({
            where: { studentId: student.id, articleId: saveArticleDto.articleId }
        });
        if (existing) {
            throw new common_1.BadRequestException('Article already saved');
        }
        const savedArticle = this.savedArticleRepo.create({
            studentId: student.id,
            articleId: saveArticleDto.articleId,
        });
        return this.savedArticleRepo.save(savedArticle);
    }
    async unsaveArticle(userId, articleId) {
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student) {
            throw new common_1.BadRequestException('Student not found');
        }
        const savedArticle = await this.savedArticleRepo.findOne({
            where: { studentId: student.id, articleId }
        });
        if (!savedArticle) {
            throw new common_1.NotFoundException('Saved article not found');
        }
        await this.savedArticleRepo.remove(savedArticle);
        return { message: 'Article removed from saved list' };
    }
    async getSavedArticles(userId) {
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student) {
            throw new common_1.BadRequestException('Student not found');
        }
        const savedArticles = await this.savedArticleRepo.find({
            where: { studentId: student.id },
            relations: ['article', 'article.user', 'article.type'],
            order: { savedAt: 'DESC' },
        });
        return savedArticles.map(saved => ({
            id: saved.id,
            savedAt: saved.savedAt,
            article: saved.article,
        }));
    }
    async isArticleSaved(userId, articleId) {
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student) {
            return false;
        }
        const savedArticle = await this.savedArticleRepo.findOne({
            where: { studentId: student.id, articleId }
        });
        return !!savedArticle;
    }
};
exports.SavedArticleService = SavedArticleService;
exports.SavedArticleService = SavedArticleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(SavedArticle_1.SavedArticle)),
    __param(1, (0, typeorm_1.InjectRepository)(Student_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(Article_1.ArticleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SavedArticleService);
//# sourceMappingURL=saved-article.service.js.map