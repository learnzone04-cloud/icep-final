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
exports.Discount = exports.DiscountScope = void 0;
const typeorm_1 = require("typeorm");
const Teacher_1 = require("../../teacher/entity/Teacher");
var DiscountScope;
(function (DiscountScope) {
    DiscountScope["ALL_COURSES"] = "all_courses";
    DiscountScope["ALL_ROOMS"] = "all_rooms";
    DiscountScope["COURSE"] = "course";
    DiscountScope["ROOM"] = "room";
})(DiscountScope || (exports.DiscountScope = DiscountScope = {}));
let Discount = class Discount {
};
exports.Discount = Discount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Discount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Discount.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Teacher_1.TeacherEntity, (teacher) => teacher.discounts),
    (0, typeorm_1.JoinColumn)({ name: 'teacherId' }),
    __metadata("design:type", Teacher_1.TeacherEntity)
], Discount.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DiscountScope }),
    __metadata("design:type", String)
], Discount.prototype, "scope", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Discount.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Discount.prototype, "percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Discount.prototype, "startAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Discount.prototype, "endAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Discount.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Discount.prototype, "createdAt", void 0);
exports.Discount = Discount = __decorate([
    (0, typeorm_1.Entity)()
], Discount);
//# sourceMappingURL=discount.entity.js.map