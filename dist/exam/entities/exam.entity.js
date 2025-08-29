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
exports.Exam = exports.ExamType = void 0;
const typeorm_1 = require("typeorm");
const course_entity_1 = require("../../course/entities/course.entity");
const course_video_entity_1 = require("../../course-video/entity/course-video.entity");
const exam_question_entity_1 = require("../../exam-question/entities/exam-question.entity");
const exam_student_entity_1 = require("../../exam-student/exam-student.entity");
var ExamType;
(function (ExamType) {
    ExamType["MidExam"] = "Mid Exam";
    ExamType["FinalExam"] = "Final Exam";
    ExamType["SpecificVideoExam"] = "Specific Video Exam";
})(ExamType || (exports.ExamType = ExamType = {}));
let Exam = class Exam {
};
exports.Exam = Exam;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Exam.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ExamType,
    }),
    __metadata("design:type", String)
], Exam.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Exam.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.Course, (course) => course.exams, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'courseId' }),
    __metadata("design:type", course_entity_1.Course)
], Exam.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_video_entity_1.CourseVideoEntity, (video) => video.exams, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'videoId' }),
    __metadata("design:type", course_video_entity_1.CourseVideoEntity)
], Exam.prototype, "video", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Exam.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 50, update: false }),
    __metadata("design:type", Number)
], Exam.prototype, "numberOfQuestions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Exam.prototype, "questionCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Exam.prototype, "valid", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exam_question_entity_1.ExamQuestion, (examQuestion) => examQuestion.exam, { cascade: true }),
    __metadata("design:type", Array)
], Exam.prototype, "questions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exam_student_entity_1.ExamStudent, (examStudent) => examStudent.exam),
    __metadata("design:type", Array)
], Exam.prototype, "examStudents", void 0);
exports.Exam = Exam = __decorate([
    (0, typeorm_1.Entity)()
], Exam);
//# sourceMappingURL=exam.entity.js.map