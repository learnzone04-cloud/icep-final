"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReelCommentModule = void 0;
const common_1 = require("@nestjs/common");
const reel_comment_service_1 = require("./reel-comment.service");
const reel_comment_controller_1 = require("./reel-comment.controller");
const typeorm_1 = require("@nestjs/typeorm");
const ReelComment_1 = require("./entity/ReelComment");
const reels_module_1 = require("../reels/reels.module");
const users_module_1 = require("../users/users.module");
let ReelCommentModule = class ReelCommentModule {
};
exports.ReelCommentModule = ReelCommentModule;
exports.ReelCommentModule = ReelCommentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ReelComment_1.ReelCommentEntity]),
            reels_module_1.ReelsModule,
            users_module_1.UsersModule,
        ],
        providers: [reel_comment_service_1.ReelCommentService],
        controllers: [reel_comment_controller_1.ReelCommentController],
    })
], ReelCommentModule);
//# sourceMappingURL=reel-comment.module.js.map