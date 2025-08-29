"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReelsModule = void 0;
const common_1 = require("@nestjs/common");
const reels_service_1 = require("./reels.service");
const reels_controller_1 = require("./reels.controller");
const typeorm_1 = require("@nestjs/typeorm");
const Reel_1 = require("./entity/Reel");
const users_module_1 = require("../users/users.module");
const notification_module_1 = require("../notification/notification.module");
const recommendation_module_1 = require("../recommendation/recommendation.module");
let ReelsModule = class ReelsModule {
};
exports.ReelsModule = ReelsModule;
exports.ReelsModule = ReelsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([Reel_1.ReelEntity]), users_module_1.UsersModule, notification_module_1.NotificationModule, recommendation_module_1.RecommendationModule],
        providers: [reels_service_1.ReelsService],
        controllers: [reels_controller_1.ReelsController],
        exports: [reels_service_1.ReelsService],
    })
], ReelsModule);
//# sourceMappingURL=reels.module.js.map