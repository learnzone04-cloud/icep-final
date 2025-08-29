"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseVideoModule = void 0;
const common_1 = require("@nestjs/common");
const course_video_service_1 = require("./course-video.service");
const course_video_controller_1 = require("./course-video.controller");
const typeorm_1 = require("@nestjs/typeorm");
const course_video_entity_1 = require("./entity/course-video.entity");
const youtube_module_1 = require("../youtube/youtube.module");
const course_module_1 = require("../course/course.module");
const admin_auth_module_1 = require("../admin-auth/admin-auth.module");
let CourseVideoModule = class CourseVideoModule {
};
exports.CourseVideoModule = CourseVideoModule;
exports.CourseVideoModule = CourseVideoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([course_video_entity_1.CourseVideoEntity]), youtube_module_1.YoutubeModule, course_module_1.CourseModule, admin_auth_module_1.AdminAuthModule],
        providers: [course_video_service_1.CourseVideoService],
        controllers: [course_video_controller_1.CourseVideoController],
        exports: [course_video_service_1.CourseVideoService],
    })
], CourseVideoModule);
//# sourceMappingURL=course-video.module.js.map