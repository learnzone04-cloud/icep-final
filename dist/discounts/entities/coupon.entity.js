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
exports.Coupon = exports.CouponScope = exports.CouponMode = void 0;
const typeorm_1 = require("typeorm");
const Teacher_1 = require("../../teacher/entity/Teacher");
var CouponMode;
(function (CouponMode) {
    CouponMode["PUBLIC"] = "public";
})(CouponMode || (exports.CouponMode = CouponMode = {}));
var CouponScope;
(function (CouponScope) {
    CouponScope["ALL_COURSES"] = "all_courses";
    CouponScope["ALL_ROOMS"] = "all_rooms";
    CouponScope["COURSE"] = "course";
    CouponScope["ROOM"] = "room";
})(CouponScope || (exports.CouponScope = CouponScope = {}));
let Coupon = class Coupon {
};
exports.Coupon = Coupon;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Coupon.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Coupon.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Teacher_1.TeacherEntity, (teacher) => teacher.coupons),
    (0, typeorm_1.JoinColumn)({ name: 'teacherId' }),
    __metadata("design:type", Teacher_1.TeacherEntity)
], Coupon.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CouponMode }),
    __metadata("design:type", String)
], Coupon.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CouponScope }),
    __metadata("design:type", String)
], Coupon.prototype, "scope", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Coupon.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Coupon.prototype, "percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Coupon.prototype, "startAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Coupon.prototype, "endAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "limitTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Coupon.prototype, "limitPerStudent", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Coupon.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Coupon.prototype, "createdAt", void 0);
exports.Coupon = Coupon = __decorate([
    (0, typeorm_1.Entity)('coupon')
], Coupon);
//# sourceMappingURL=coupon.entity.js.map