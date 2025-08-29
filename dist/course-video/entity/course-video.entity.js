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
exports.CourseVideoEntity = void 0;
const course_entity_1 = require("../../course/entities/course.entity");
const exam_entity_1 = require("../../exam/entities/exam.entity");
const typeorm_1 = require("typeorm");
let CourseVideoEntity = class CourseVideoEntity {
};
exports.CourseVideoEntity = CourseVideoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CourseVideoEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CourseVideoEntity.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CourseVideoEntity.prototype, "youtubeVideoId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CourseVideoEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], CourseVideoEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CourseVideoEntity.prototype, "thumbnail_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CourseVideoEntity.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], CourseVideoEntity.prototype, "approaved", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CourseVideoEntity.prototype, "privacyStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CourseVideoEntity.prototype, "videoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], CourseVideoEntity.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.Course, (type) => type.courseVideos, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'courseId' }),
    __metadata("design:type", course_entity_1.Course)
], CourseVideoEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exam_entity_1.Exam, (exam) => exam.video),
    __metadata("design:type", Array)
], CourseVideoEntity.prototype, "exams", void 0);
exports.CourseVideoEntity = CourseVideoEntity = __decorate([
    (0, typeorm_1.Entity)()
], CourseVideoEntity);
//# sourceMappingURL=course-video.entity.js.map