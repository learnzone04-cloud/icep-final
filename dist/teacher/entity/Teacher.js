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
exports.TeacherEntity = void 0;
const certificate_entity_1 = require("../../certificate/entities/certificate.entity");
const course_entity_1 = require("../../course/entities/course.entity");
const follower_entity_1 = require("../../follower/entities/follower.entity");
const Type_1 = require("../../types/entity/Type");
const User_1 = require("../../users/entity/User");
const ConversationRoom_1 = require("../../conversation-room/entity/ConversationRoom");
const Story_1 = require("../../story/entity/Story");
const rate_entity_1 = require("../../rate/entities/rate.entity");
const discount_entity_1 = require("../../discounts/entities/discount.entity");
const coupon_entity_1 = require("../../discounts/entities/coupon.entity");
const typeorm_1 = require("typeorm");
let TeacherEntity = class TeacherEntity {
};
exports.TeacherEntity = TeacherEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TeacherEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeacherEntity.prototype, "facebookUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeacherEntity.prototype, "instagramUrl", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => certificate_entity_1.CertificateEntity, (type) => type.teacher),
    __metadata("design:type", certificate_entity_1.CertificateEntity)
], TeacherEntity.prototype, "certificate", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], TeacherEntity.prototype, "coverLetter", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeacherEntity.prototype, "cv", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TeacherEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TeacherEntity.prototype, "typeId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => User_1.UserEntity, (user) => user.teacher),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.UserEntity)
], TeacherEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Type_1.TypeEntity, (type) => type.teachers),
    (0, typeorm_1.JoinColumn)({ name: 'typeId' }),
    __metadata("design:type", Type_1.TypeEntity)
], TeacherEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => follower_entity_1.Follower, (type) => type.teacher),
    __metadata("design:type", Array)
], TeacherEntity.prototype, "followers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => course_entity_1.Course, (type) => type.teacher),
    __metadata("design:type", Array)
], TeacherEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ConversationRoom_1.ConversationRoom, room => room.teacher),
    __metadata("design:type", Array)
], TeacherEntity.prototype, "conversationRooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Story_1.Story, story => story.teacher),
    __metadata("design:type", Array)
], TeacherEntity.prototype, "stories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rate_entity_1.Rate, (rate) => rate.teacher),
    __metadata("design:type", Array)
], TeacherEntity.prototype, "rates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => discount_entity_1.Discount, (discount) => discount.teacher),
    __metadata("design:type", Array)
], TeacherEntity.prototype, "discounts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => coupon_entity_1.Coupon, (coupon) => coupon.teacher),
    __metadata("design:type", Array)
], TeacherEntity.prototype, "coupons", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TeacherEntity.prototype, "createdAt", void 0);
exports.TeacherEntity = TeacherEntity = __decorate([
    (0, typeorm_1.Entity)('teachers')
], TeacherEntity);
//# sourceMappingURL=Teacher.js.map