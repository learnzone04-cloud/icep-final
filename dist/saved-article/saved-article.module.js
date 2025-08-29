"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedArticleModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const SavedArticle_1 = require("./entity/SavedArticle");
const saved_article_service_1 = require("./saved-article.service");
const saved_article_controller_1 = require("./saved-article.controller");
const Student_1 = require("../student/entity/Student");
const Article_1 = require("../article/entity/Article");
let SavedArticleModule = class SavedArticleModule {
};
exports.SavedArticleModule = SavedArticleModule;
exports.SavedArticleModule = SavedArticleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([SavedArticle_1.SavedArticle, Student_1.Student, Article_1.ArticleEntity]),
        ],
        controllers: [saved_article_controller_1.SavedArticleController],
        providers: [saved_article_service_1.SavedArticleService],
        exports: [saved_article_service_1.SavedArticleService],
    })
], SavedArticleModule);
//# sourceMappingURL=saved-article.module.js.map