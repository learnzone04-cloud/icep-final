"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModule = void 0;
const common_1 = require("@nestjs/common");
const course_service_1 = require("./course.service");
const course_controller_1 = require("./course.controller");
const typeorm_1 = require("@nestjs/typeorm");
const course_entity_1 = require("./entities/course.entity");
const teacher_module_1 = require("../teacher/teacher.module");
const types_module_1 = require("../types/types.module");
const course_video_entity_1 = require("../course-video/entity/course-video.entity");
const Teacher_1 = require("../teacher/entity/Teacher");
const User_1 = require("../users/entity/User");
const notification_module_1 = require("../notification/notification.module");
const discounts_module_1 = require("../discounts/discounts.module");
let CourseModule = class CourseModule {
};
exports.CourseModule = CourseModule;
exports.CourseModule = CourseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                course_entity_1.Course,
                course_video_entity_1.CourseVideoEntity,
                Teacher_1.TeacherEntity,
                User_1.UserEntity,
            ]),
            teacher_module_1.TeacherModule,
            types_module_1.TypesModule,
            notification_module_1.NotificationModule,
            discounts_module_1.DiscountsModule,
        ],
        controllers: [course_controller_1.CourseController],
        providers: [course_service_1.CourseService],
        exports: [course_service_1.CourseService]
    })
], CourseModule);
//# sourceMappingURL=course.module.js.map