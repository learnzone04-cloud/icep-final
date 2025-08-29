"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const exam_entity_1 = require("./entities/exam.entity");
const exam_controller_1 = require("./exam.controller");
const exam_service_1 = require("./exam.service");
const course_module_1 = require("../course/course.module");
const course_video_entity_1 = require("../course-video/entity/course-video.entity");
const exam_question_entity_1 = require("../exam-question/entities/exam-question.entity");
const Student_1 = require("../student/entity/Student");
const exam_student_entity_1 = require("../exam-student/exam-student.entity");
const Teacher_1 = require("../teacher/entity/Teacher");
let ExamModule = class ExamModule {
};
exports.ExamModule = ExamModule;
exports.ExamModule = ExamModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([exam_entity_1.Exam, course_video_entity_1.CourseVideoEntity, exam_question_entity_1.ExamQuestion, exam_student_entity_1.ExamStudent, Student_1.Student, Teacher_1.TeacherEntity]),
            course_module_1.CourseModule,
        ],
        controllers: [exam_controller_1.ExamController],
        providers: [exam_service_1.ExamService],
    })
], ExamModule);
//# sourceMappingURL=exam.module.js.map