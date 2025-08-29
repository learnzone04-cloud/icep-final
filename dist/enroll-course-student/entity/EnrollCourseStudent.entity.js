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
exports.EnrollCourseStudent = void 0;
const typeorm_1 = require("typeorm");
const Student_1 = require("../../student/entity/Student");
const course_entity_1 = require("../../course/entities/course.entity");
let EnrollCourseStudent = class EnrollCourseStudent {
};
exports.EnrollCourseStudent = EnrollCourseStudent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EnrollCourseStudent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], EnrollCourseStudent.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], EnrollCourseStudent.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EnrollCourseStudent.prototype, "enrollDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], EnrollCourseStudent.prototype, "isPass", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], EnrollCourseStudent.prototype, "mark", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Student_1.Student, (student) => student.enrollments),
    __metadata("design:type", Student_1.Student)
], EnrollCourseStudent.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.Course, (course) => course.enrollments),
    __metadata("design:type", course_entity_1.Course)
], EnrollCourseStudent.prototype, "course", void 0);
exports.EnrollCourseStudent = EnrollCourseStudent = __decorate([
    (0, typeorm_1.Entity)('enroll_course_student')
], EnrollCourseStudent);
//# sourceMappingURL=EnrollCourseStudent.entity.js.map