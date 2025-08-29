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
exports.Lesson = exports.LessonStatus = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../../users/entity/User");
const chat_entity_1 = require("../../chat/entities/chat.entity");
var LessonStatus;
(function (LessonStatus) {
    LessonStatus["SCHEDULED"] = "SCHEDULED";
    LessonStatus["COMPLETED"] = "COMPLETED";
    LessonStatus["CANCELLED"] = "CANCELLED";
    LessonStatus["RESCHEDULED"] = "RESCHEDULED";
})(LessonStatus || (exports.LessonStatus = LessonStatus = {}));
let Lesson = class Lesson {
};
exports.Lesson = Lesson;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Lesson.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Lesson.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Lesson.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Lesson.prototype, "lessonDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Lesson.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Lesson.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Lesson.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: LessonStatus,
        default: LessonStatus.SCHEDULED
    }),
    __metadata("design:type", String)
], Lesson.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lesson.prototype, "meetLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lesson.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Lesson.prototype, "chatId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Lesson.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Lesson.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.UserEntity),
    (0, typeorm_1.JoinColumn)({ name: 'teacherId' }),
    __metadata("design:type", User_1.UserEntity)
], Lesson.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.UserEntity),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", User_1.UserEntity)
], Lesson.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_entity_1.Chat),
    (0, typeorm_1.JoinColumn)({ name: 'chatId' }),
    __metadata("design:type", chat_entity_1.Chat)
], Lesson.prototype, "chat", void 0);
exports.Lesson = Lesson = __decorate([
    (0, typeorm_1.Entity)()
], Lesson);
//# sourceMappingURL=Lesson.js.map