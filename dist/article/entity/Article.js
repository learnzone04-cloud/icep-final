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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleEntity = void 0;
const ArticleComment_1 = require("../../article-comment/entity/ArticleComment");
const ArticleLike_1 = require("../../article-like/entity/ArticleLike");
const ArticleReed_1 = require("../../article-reed/entity/ArticleReed");
const SavedArticle_1 = require("../../saved-article/entity/SavedArticle");
const Type_1 = require("../../types/entity/Type");
const User_1 = require("../../users/entity/User");
const typeorm_1 = require("typeorm");
let ArticleEntity = class ArticleEntity {
};
exports.ArticleEntity = ArticleEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ArticleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ArticleEntity.prototype, "article", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ArticleEntity.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ArticleEntity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ArticleEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ArticleEntity.prototype, "typeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Type_1.TypeEntity, (type) => type.articles),
    (0, typeorm_1.JoinColumn)({ name: 'typeId' }),
    __metadata("design:type", Type_1.TypeEntity)
], ArticleEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.UserEntity, (type) => type.articles),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.UserEntity)
], ArticleEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ArticleLike_1.ArticleLike, (like) => like.article),
    __metadata("design:type", Array)
], ArticleEntity.prototype, "articleLikes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ArticleComment_1.ArticleComment, (comment) => comment.article),
    __metadata("design:type", Array)
], ArticleEntity.prototype, "articleComments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ArticleReed_1.ArticleRead, (read) => read.article),
    __metadata("design:type", Array)
], ArticleEntity.prototype, "articleReads", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SavedArticle_1.SavedArticle, (savedArticle) => savedArticle.article),
    __metadata("design:type", Array)
], ArticleEntity.prototype, "savedArticles", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ArticleEntity.prototype, "createdAt", void 0);
exports.ArticleEntity = ArticleEntity = __decorate([
    (0, typeorm_1.Entity)('articles')
], ArticleEntity);
//# sourceMappingURL=Article.js.map