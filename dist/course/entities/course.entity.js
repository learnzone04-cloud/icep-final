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
exports.Course = void 0;
const course_video_entity_1 = require("../../course-video/entity/course-video.entity");
const Teacher_1 = require("../../teacher/entity/Teacher");
const Type_1 = require("../../types/entity/Type");
const exam_entity_1 = require("../../exam/entities/exam.entity");
const EnrollCourseStudent_entity_1 = require("../../enroll-course-student/entity/EnrollCourseStudent.entity");
const placement_test_entity_1 = require("../../placement-test/placement-test.entity");
const typeorm_1 = require("typeorm");
let Course = class Course {
};
exports.Course = Course;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Course.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Course.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Course.prototype, "typeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Course.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Course.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Course.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Course.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Course.prototype, "videosNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'usd', update: false }),
    __metadata("design:type", String)
], Course.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Course.prototype, "examCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 100 }),
    __metadata("design:type", Number)
], Course.prototype, "maxGrade", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Course.prototype, "passGrade", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Course.prototype, "hasPassFailSystem", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: placement_test_entity_1.PlacementLevel,
        nullable: true,
    }),
    __metadata("design:type", String)
], Course.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Teacher_1.TeacherEntity, (type) => type.course),
    (0, typeorm_1.JoinColumn)({ name: 'teacherId' }),
    __metadata("design:type", Teacher_1.TeacherEntity)
], Course.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Type_1.TypeEntity, (type) => type.course),
    (0, typeorm_1.JoinColumn)({ name: 'typeId' }),
    __metadata("design:type", Type_1.TypeEntity)
], Course.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => course_video_entity_1.CourseVideoEntity, (type) => type.courseId),
    __metadata("design:type", course_video_entity_1.CourseVideoEntity)
], Course.prototype, "courseVideos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exam_entity_1.Exam, (exam) => exam.course),
    __metadata("design:type", Array)
], Course.prototype, "exams", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EnrollCourseStudent_entity_1.EnrollCourseStudent, (enrollment) => enrollment.course),
    __metadata("design:type", Array)
], Course.prototype, "enrollments", void 0);
exports.Course = Course = __decorate([
    (0, typeorm_1.Entity)()
], Course);
//# sourceMappingURL=course.entity.js.map