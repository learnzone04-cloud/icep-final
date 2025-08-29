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
exports.SavedArticle = void 0;
const Article_1 = require("../../article/entity/Article");
const Student_1 = require("../../student/entity/Student");
const typeorm_1 = require("typeorm");
let SavedArticle = class SavedArticle {
};
exports.SavedArticle = SavedArticle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SavedArticle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SavedArticle.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SavedArticle.prototype, "articleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Student_1.Student, (student) => student.savedArticles),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", Student_1.Student)
], SavedArticle.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Article_1.ArticleEntity, (article) => article.savedArticles),
    (0, typeorm_1.JoinColumn)({ name: 'articleId' }),
    __metadata("design:type", Article_1.ArticleEntity)
], SavedArticle.prototype, "article", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SavedArticle.prototype, "savedAt", void 0);
exports.SavedArticle = SavedArticle = __decorate([
    (0, typeorm_1.Entity)('saved_articles')
], SavedArticle);
//# sourceMappingURL=SavedArticle.js.map