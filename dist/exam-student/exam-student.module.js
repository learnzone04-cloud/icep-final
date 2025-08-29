"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamStudentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const exam_student_entity_1 = require("./exam-student.entity");
const Student_1 = require("../student/entity/Student");
const exam_entity_1 = require("../exam/entities/exam.entity");
const EnrollCourseStudent_entity_1 = require("../enroll-course-student/entity/EnrollCourseStudent.entity");
const exam_student_service_1 = require("./exam-student.service");
const exam_student_controller_1 = require("./exam-student.controller");
const course_video_progress_module_1 = require("../course-video-progress/course-video-progress.module");
let ExamStudentModule = class ExamStudentModule {
};
exports.ExamStudentModule = ExamStudentModule;
exports.ExamStudentModule = ExamStudentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([exam_student_entity_1.ExamStudent, Student_1.Student, exam_entity_1.Exam, EnrollCourseStudent_entity_1.EnrollCourseStudent]),
            course_video_progress_module_1.CourseVideoProgressModule,
        ],
        providers: [exam_student_service_1.ExamStudentService],
        controllers: [exam_student_controller_1.ExamStudentController],
        exports: [exam_student_service_1.ExamStudentService],
    })
], ExamStudentModule);
//# sourceMappingURL=exam-student.module.js.map