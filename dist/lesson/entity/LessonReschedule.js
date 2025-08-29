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
exports.LessonReschedule = exports.RescheduleStatus = exports.RescheduleRequestedBy = void 0;
const typeorm_1 = require("typeorm");
const Lesson_1 = require("./Lesson");
var RescheduleRequestedBy;
(function (RescheduleRequestedBy) {
    RescheduleRequestedBy["STUDENT"] = "STUDENT";
    RescheduleRequestedBy["TEACHER"] = "TEACHER";
})(RescheduleRequestedBy || (exports.RescheduleRequestedBy = RescheduleRequestedBy = {}));
var RescheduleStatus;
(function (RescheduleStatus) {
    RescheduleStatus["PENDING"] = "PENDING";
    RescheduleStatus["APPROVED"] = "APPROVED";
    RescheduleStatus["REJECTED"] = "REJECTED";
})(RescheduleStatus || (exports.RescheduleStatus = RescheduleStatus = {}));
let LessonReschedule = class LessonReschedule {
};
exports.LessonReschedule = LessonReschedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LessonReschedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LessonReschedule.prototype, "lessonId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RescheduleRequestedBy
    }),
    __metadata("design:type", String)
], LessonReschedule.prototype, "requestedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], LessonReschedule.prototype, "oldDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], LessonReschedule.prototype, "oldStartTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], LessonReschedule.prototype, "newDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], LessonReschedule.prototype, "newStartTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RescheduleStatus,
        default: RescheduleStatus.PENDING
    }),
    __metadata("design:type", String)
], LessonReschedule.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LessonReschedule.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LessonReschedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LessonReschedule.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Lesson_1.Lesson),
    (0, typeorm_1.JoinColumn)({ name: 'lessonId' }),
    __metadata("design:type", Lesson_1.Lesson)
], LessonReschedule.prototype, "lesson", void 0);
exports.LessonReschedule = LessonReschedule = __decorate([
    (0, typeorm_1.Entity)()
], LessonReschedule);
//# sourceMappingURL=LessonReschedule.js.map