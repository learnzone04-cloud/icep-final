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
exports.ReelEntity = void 0;
const ReelComment_1 = require("../../reel-comment/entity/ReelComment");
const ReelLike_1 = require("../../reel-like/entity/ReelLike");
const Type_1 = require("../../types/entity/Type");
const User_1 = require("../../users/entity/User");
const typeorm_1 = require("typeorm");
let ReelEntity = class ReelEntity {
};
exports.ReelEntity = ReelEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReelEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReelEntity.prototype, "reelPath", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReelEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReelEntity.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReelEntity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ReelEntity.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReelEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReelEntity.prototype, "typeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Type_1.TypeEntity, (type) => type.reels),
    (0, typeorm_1.JoinColumn)({ name: 'typeId' }),
    __metadata("design:type", Type_1.TypeEntity)
], ReelEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.UserEntity, (type) => type.reels),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.UserEntity)
], ReelEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReelLike_1.ReelLikeEntity, (reel) => reel.reel),
    __metadata("design:type", Array)
], ReelEntity.prototype, "likes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReelComment_1.ReelCommentEntity, (reel) => reel.reel),
    __metadata("design:type", Array)
], ReelEntity.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReelEntity.prototype, "createdAt", void 0);
exports.ReelEntity = ReelEntity = __decorate([
    (0, typeorm_1.Entity)('reels')
], ReelEntity);
//# sourceMappingURL=Reel.js.map