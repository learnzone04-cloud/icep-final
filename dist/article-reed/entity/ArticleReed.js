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
exports.ArticleRead = void 0;
const Article_1 = require("../../article/entity/Article");
const User_1 = require("../../users/entity/User");
const typeorm_1 = require("typeorm");
let ArticleRead = class ArticleRead {
};
exports.ArticleRead = ArticleRead;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ArticleRead.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ArticleRead.prototype, "articleId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ArticleRead.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Article_1.ArticleEntity, (article) => article.articleReads, { onDelete: 'CASCADE' }),
    __metadata("design:type", Article_1.ArticleEntity)
], ArticleRead.prototype, "article", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.UserEntity, (student) => student.articleReads),
    __metadata("design:type", User_1.UserEntity)
], ArticleRead.prototype, "student", void 0);
exports.ArticleRead = ArticleRead = __decorate([
    (0, typeorm_1.Entity)()
], ArticleRead);
//# sourceMappingURL=ArticleReed.js.map