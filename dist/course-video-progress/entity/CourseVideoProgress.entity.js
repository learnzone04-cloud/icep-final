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
exports.CourseVideoProgress = void 0;
const typeorm_1 = require("typeorm");
const Student_1 = require("../../student/entity/Student");
const course_entity_1 = require("../../course/entities/course.entity");
const course_video_entity_1 = require("../../course-video/entity/course-video.entity");
let CourseVideoProgress = class CourseVideoProgress {
};
exports.CourseVideoProgress = CourseVideoProgress;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CourseVideoProgress.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CourseVideoProgress.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CourseVideoProgress.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CourseVideoProgress.prototype, "videoId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CourseVideoProgress.prototype, "videoNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], CourseVideoProgress.prototype, "isUnlocked", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], CourseVideoProgress.prototype, "isWatched", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Student_1.Student, (student) => student.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", Student_1.Student)
], CourseVideoProgress.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.Course, (course) => course.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'courseId' }),
    __metadata("design:type", course_entity_1.Course)
], CourseVideoProgress.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_video_entity_1.CourseVideoEntity, (video) => video.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'videoId' }),
    __metadata("design:type", course_video_entity_1.CourseVideoEntity)
], CourseVideoProgress.prototype, "video", void 0);
exports.CourseVideoProgress = CourseVideoProgress = __decorate([
    (0, typeorm_1.Entity)()
], CourseVideoProgress);
//# sourceMappingURL=CourseVideoProgress.entity.js.map