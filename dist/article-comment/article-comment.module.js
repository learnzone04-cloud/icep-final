"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleCommentModule = void 0;
const common_1 = require("@nestjs/common");
const article_comment_service_1 = require("./article-comment.service");
const article_comment_controller_1 = require("./article-comment.controller");
const typeorm_1 = require("@nestjs/typeorm");
const ArticleComment_1 = require("./entity/ArticleComment");
const users_module_1 = require("../users/users.module");
const article_module_1 = require("../article/article.module");
let ArticleCommentModule = class ArticleCommentModule {
};
exports.ArticleCommentModule = ArticleCommentModule;
exports.ArticleCommentModule = ArticleCommentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ArticleComment_1.ArticleComment]),
            users_module_1.UsersModule,
            article_module_1.ArticleModule,
        ],
        providers: [article_comment_service_1.ArticleCommentService],
        controllers: [article_comment_controller_1.ArticleCommentController],
    })
], ArticleCommentModule);
//# sourceMappingURL=article-comment.module.js.map