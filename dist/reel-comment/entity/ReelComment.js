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
exports.ReelCommentEntity = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../../users/entity/User");
const Reel_1 = require("../../reels/entity/Reel");
let ReelCommentEntity = class ReelCommentEntity {
};
exports.ReelCommentEntity = ReelCommentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReelCommentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", String)
], ReelCommentEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Reel_1.ReelEntity, (reel) => reel.comments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'reelId' }),
    __metadata("design:type", Reel_1.ReelEntity)
], ReelCommentEntity.prototype, "reel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReelCommentEntity.prototype, "reelId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.UserEntity, (user) => user.reelComment, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", User_1.UserEntity)
], ReelCommentEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReelCommentEntity.prototype, "studentId", void 0);
exports.ReelCommentEntity = ReelCommentEntity = __decorate([
    (0, typeorm_1.Entity)('reel_comments')
], ReelCommentEntity);
//# sourceMappingURL=ReelComment.js.map