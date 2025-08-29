"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseVideoProgressModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const CourseVideoProgress_entity_1 = require("./entity/CourseVideoProgress.entity");
const course_video_progress_service_1 = require("./course-video-progress.service");
const course_video_progress_controller_1 = require("./course-video-progress.controller");
const Student_1 = require("../student/entity/Student");
const course_entity_1 = require("../course/entities/course.entity");
const course_video_entity_1 = require("../course-video/entity/course-video.entity");
let CourseVideoProgressModule = class CourseVideoProgressModule {
};
exports.CourseVideoProgressModule = CourseVideoProgressModule;
exports.CourseVideoProgressModule = CourseVideoProgressModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([CourseVideoProgress_entity_1.CourseVideoProgress, Student_1.Student, course_entity_1.Course, course_video_entity_1.CourseVideoEntity])],
        providers: [course_video_progress_service_1.CourseVideoProgressService],
        controllers: [course_video_progress_controller_1.CourseVideoProgressController],
        exports: [course_video_progress_service_1.CourseVideoProgressService],
    })
], CourseVideoProgressModule);
//# sourceMappingURL=course-video-progress.module.js.map