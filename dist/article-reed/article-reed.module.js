"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleReedModule = void 0;
const common_1 = require("@nestjs/common");
const article_reed_service_1 = require("./article-reed.service");
const article_reed_controller_1 = require("./article-reed.controller");
const typeorm_1 = require("@nestjs/typeorm");
const ArticleReed_1 = require("./entity/ArticleReed");
const article_module_1 = require("../article/article.module");
const users_module_1 = require("../users/users.module");
let ArticleReedModule = class ArticleReedModule {
};
exports.ArticleReedModule = ArticleReedModule;
exports.ArticleReedModule = ArticleReedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ArticleReed_1.ArticleRead]),
            article_module_1.ArticleModule,
            users_module_1.UsersModule,
        ],
        providers: [article_reed_service_1.ArticleReedService],
        controllers: [article_reed_controller_1.ArticleReedController],
    })
], ArticleReedModule);
//# sourceMappingURL=article-reed.module.js.map