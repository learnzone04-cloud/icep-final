"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleModule = void 0;
const common_1 = require("@nestjs/common");
const article_service_1 = require("./article.service");
const article_controller_1 = require("./article.controller");
const typeorm_1 = require("@nestjs/typeorm");
const Article_1 = require("./entity/Article");
const users_module_1 = require("../users/users.module");
const notification_module_1 = require("../notification/notification.module");
const recommendation_module_1 = require("../recommendation/recommendation.module");
let ArticleModule = class ArticleModule {
};
exports.ArticleModule = ArticleModule;
exports.ArticleModule = ArticleModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([Article_1.ArticleEntity]), users_module_1.UsersModule, notification_module_1.NotificationModule, recommendation_module_1.RecommendationModule],
        providers: [article_service_1.ArticleService],
        controllers: [article_controller_1.ArticleController],
        exports: [article_service_1.ArticleService],
    })
], ArticleModule);
//# sourceMappingURL=article.module.js.map