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
exports.ExamStudent = void 0;
const typeorm_1 = require("typeorm");
const exam_entity_1 = require("../exam/entities/exam.entity");
const Student_1 = require("../student/entity/Student");
let ExamStudent = class ExamStudent {
};
exports.ExamStudent = ExamStudent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ExamStudent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ExamStudent.prototype, "examId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ExamStudent.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ExamStudent.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], ExamStudent.prototype, "mark", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ExamStudent.prototype, "examType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exam_entity_1.Exam, (exam) => exam.examStudents, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'examId' }),
    __metadata("design:type", exam_entity_1.Exam)
], ExamStudent.prototype, "exam", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Student_1.Student, (student) => student.examStudents, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", Student_1.Student)
], ExamStudent.prototype, "student", void 0);
exports.ExamStudent = ExamStudent = __decorate([
    (0, typeorm_1.Entity)()
], ExamStudent);
//# sourceMappingURL=exam-student.entity.js.map