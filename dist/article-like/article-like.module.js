"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleLikeModule = void 0;
const common_1 = require("@nestjs/common");
const article_like_service_1 = require("./article-like.service");
const article_like_controller_1 = require("./article-like.controller");
const typeorm_1 = require("@nestjs/typeorm");
const ArticleLike_1 = require("./entity/ArticleLike");
const article_module_1 = require("../article/article.module");
const users_module_1 = require("../users/users.module");
let ArticleLikeModule = class ArticleLikeModule {
};
exports.ArticleLikeModule = ArticleLikeModule;
exports.ArticleLikeModule = ArticleLikeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ArticleLike_1.ArticleLike]),
            article_module_1.ArticleModule,
            users_module_1.UsersModule,
        ],
        providers: [article_like_service_1.ArticleLikeService],
        controllers: [article_like_controller_1.ArticleLikeController],
    })
], ArticleLikeModule);
//# sourceMappingURL=article-like.module.js.map