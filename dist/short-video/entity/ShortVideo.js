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
exports.ShortVideoEntity = void 0;
const ShortVideoComment_1 = require("../../short-video-comment/entity/ShortVideoComment");
const ShortVideoLike_1 = require("../../short-video-like/entity/ShortVideoLike");
const Type_1 = require("../../types/entity/Type");
const User_1 = require("../../users/entity/User");
const typeorm_1 = require("typeorm");
let ShortVideoEntity = class ShortVideoEntity {
};
exports.ShortVideoEntity = ShortVideoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ShortVideoEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ShortVideoEntity.prototype, "videoPath", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ShortVideoEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ShortVideoEntity.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ShortVideoEntity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ShortVideoEntity.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ShortVideoEntity.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ShortVideoEntity.prototype, "typeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Type_1.TypeEntity, (type) => type.shortVideos),
    (0, typeorm_1.JoinColumn)({ name: 'typeId' }),
    __metadata("design:type", Type_1.TypeEntity)
], ShortVideoEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.UserEntity, (user) => user.shortVideos),
    (0, typeorm_1.JoinColumn)({ name: 'teacherId' }),
    __metadata("design:type", User_1.UserEntity)
], ShortVideoEntity.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ShortVideoLike_1.ShortVideoLikeEntity, (like) => like.shortVideo),
    __metadata("design:type", Array)
], ShortVideoEntity.prototype, "likes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ShortVideoComment_1.ShortVideoCommentEntity, (comment) => comment.shortVideo),
    __metadata("design:type", Array)
], ShortVideoEntity.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ShortVideoEntity.prototype, "createdAt", void 0);
exports.ShortVideoEntity = ShortVideoEntity = __decorate([
    (0, typeorm_1.Entity)('short_videos')
], ShortVideoEntity);
//# sourceMappingURL=ShortVideo.js.map