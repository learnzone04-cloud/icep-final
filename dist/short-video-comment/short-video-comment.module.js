"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortVideoCommentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ShortVideoComment_1 = require("./entity/ShortVideoComment");
const short_video_comment_service_1 = require("./short-video-comment.service");
const short_video_comment_controller_1 = require("./short-video-comment.controller");
const users_module_1 = require("../users/users.module");
const short_video_module_1 = require("../short-video/short-video.module");
let ShortVideoCommentModule = class ShortVideoCommentModule {
};
exports.ShortVideoCommentModule = ShortVideoCommentModule;
exports.ShortVideoCommentModule = ShortVideoCommentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ShortVideoComment_1.ShortVideoCommentEntity]), users_module_1.UsersModule, short_video_module_1.ShortVideoModule],
        controllers: [short_video_comment_controller_1.ShortVideoCommentController],
        providers: [short_video_comment_service_1.ShortVideoCommentService],
        exports: [short_video_comment_service_1.ShortVideoCommentService],
    })
], ShortVideoCommentModule);
//# sourceMappingURL=short-video-comment.module.js.map