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
exports.ArticleComment = void 0;
const Article_1 = require("../../article/entity/Article");
const User_1 = require("../../users/entity/User");
const typeorm_1 = require("typeorm");
let ArticleComment = class ArticleComment {
};
exports.ArticleComment = ArticleComment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ArticleComment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ArticleComment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ArticleComment.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ArticleComment.prototype, "articleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.UserEntity, (student) => student.articleComments),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", User_1.UserEntity)
], ArticleComment.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Article_1.ArticleEntity, (article) => article.articleComments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'articleId' }),
    __metadata("design:type", Article_1.ArticleEntity)
], ArticleComment.prototype, "article", void 0);
exports.ArticleComment = ArticleComment = __decorate([
    (0, typeorm_1.Entity)()
], ArticleComment);
//# sourceMappingURL=ArticleComment.js.map