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
exports.ShortVideoLikeEntity = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../../users/entity/User");
const ShortVideo_1 = require("../../short-video/entity/ShortVideo");
let ShortVideoLikeEntity = class ShortVideoLikeEntity {
};
exports.ShortVideoLikeEntity = ShortVideoLikeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ShortVideoLikeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ShortVideoLikeEntity.prototype, "isLiked", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ShortVideo_1.ShortVideoEntity, (shortVideo) => shortVideo.likes, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'shortVideoId' }),
    __metadata("design:type", ShortVideo_1.ShortVideoEntity)
], ShortVideoLikeEntity.prototype, "shortVideo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ShortVideoLikeEntity.prototype, "shortVideoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.UserEntity, (user) => user.shortVideoLikes, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", User_1.UserEntity)
], ShortVideoLikeEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ShortVideoLikeEntity.prototype, "studentId", void 0);
exports.ShortVideoLikeEntity = ShortVideoLikeEntity = __decorate([
    (0, typeorm_1.Entity)('short_video_likes')
], ShortVideoLikeEntity);
//# sourceMappingURL=ShortVideoLike.js.map