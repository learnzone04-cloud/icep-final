"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const statistics_controller_1 = require("./statistics.controller");
const User_1 = require("../users/entity/User");
const Teacher_1 = require("../teacher/entity/Teacher");
const Reel_1 = require("../reels/entity/Reel");
const Article_1 = require("../article/entity/Article");
const ShortVideo_1 = require("../short-video/entity/ShortVideo");
const course_entity_1 = require("../course/entities/course.entity");
const EnrollCourseStudent_entity_1 = require("../enroll-course-student/entity/EnrollCourseStudent.entity");
let StatisticsModule = class StatisticsModule {
};
exports.StatisticsModule = StatisticsModule;
exports.StatisticsModule = StatisticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                User_1.UserEntity,
                Teacher_1.TeacherEntity,
                Reel_1.ReelEntity,
                Article_1.ArticleEntity,
                ShortVideo_1.ShortVideoEntity,
                course_entity_1.Course,
                EnrollCourseStudent_entity_1.EnrollCourseStudent,
            ]),
        ],
        controllers: [statistics_controller_1.StatisticsController],
    })
], StatisticsModule);
//# sourceMappingURL=statistics.module.js.map