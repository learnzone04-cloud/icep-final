"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortVideoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ShortVideo_1 = require("./entity/ShortVideo");
const short_video_service_1 = require("./short-video.service");
const short_video_controller_1 = require("./short-video.controller");
const users_module_1 = require("../users/users.module");
const notification_module_1 = require("../notification/notification.module");
const recommendation_module_1 = require("../recommendation/recommendation.module");
let ShortVideoModule = class ShortVideoModule {
};
exports.ShortVideoModule = ShortVideoModule;
exports.ShortVideoModule = ShortVideoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ShortVideo_1.ShortVideoEntity]), users_module_1.UsersModule, notification_module_1.NotificationModule, recommendation_module_1.RecommendationModule],
        controllers: [short_video_controller_1.ShortVideoController],
        providers: [short_video_service_1.ShortVideoService],
        exports: [short_video_service_1.ShortVideoService],
    })
], ShortVideoModule);
//# sourceMappingURL=short-video.module.js.map