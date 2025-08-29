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
exports.UserRecommendation = void 0;
const typeorm_1 = require("typeorm");
let UserRecommendation = class UserRecommendation {
};
exports.UserRecommendation = UserRecommendation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserRecommendation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserRecommendation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserRecommendation.prototype, "contentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserRecommendation.prototype, "contentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 3 }),
    __metadata("design:type", Number)
], UserRecommendation.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserRecommendation.prototype, "rank", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 3 }),
    __metadata("design:type", Number)
], UserRecommendation.prototype, "levelScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 3 }),
    __metadata("design:type", Number)
], UserRecommendation.prototype, "tagScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 3 }),
    __metadata("design:type", Number)
], UserRecommendation.prototype, "teacherScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 3 }),
    __metadata("design:type", Number)
], UserRecommendation.prototype, "engagementMultiplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 3 }),
    __metadata("design:type", Number)
], UserRecommendation.prototype, "recencyFactor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserRecommendation.prototype, "contentLevel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserRecommendation.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], UserRecommendation.prototype, "isTeacherFollowed", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserRecommendation.prototype, "cachedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], UserRecommendation.prototype, "expiresAt", void 0);
exports.UserRecommendation = UserRecommendation = __decorate([
    (0, typeorm_1.Entity)('user_recommendations'),
    (0, typeorm_1.Index)(['userId', 'contentType']),
    (0, typeorm_1.Index)(['userId', 'score'])
], UserRecommendation);
//# sourceMappingURL=UserRecommendation.js.map