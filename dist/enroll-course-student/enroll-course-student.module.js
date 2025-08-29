"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollCourseStudentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const EnrollCourseStudent_entity_1 = require("./entity/EnrollCourseStudent.entity");
const Student_1 = require("../student/entity/Student");
const course_entity_1 = require("../course/entities/course.entity");
const enrollment_controller_1 = require("./enrollment.controller");
const enrollment_service_1 = require("./enrollment.service");
const course_video_progress_module_1 = require("../course-video-progress/course-video-progress.module");
const discounts_module_1 = require("../discounts/discounts.module");
let EnrollCourseStudentModule = class EnrollCourseStudentModule {
};
exports.EnrollCourseStudentModule = EnrollCourseStudentModule;
exports.EnrollCourseStudentModule = EnrollCourseStudentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([EnrollCourseStudent_entity_1.EnrollCourseStudent, Student_1.Student, course_entity_1.Course]),
            course_video_progress_module_1.CourseVideoProgressModule,
            discounts_module_1.DiscountsModule,
        ],
        providers: [enrollment_service_1.EnrollmentService],
        controllers: [enrollment_controller_1.EnrollmentController],
        exports: [typeorm_1.TypeOrmModule],
    })
], EnrollCourseStudentModule);
//# sourceMappingURL=enroll-course-student.module.js.map