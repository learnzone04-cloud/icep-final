"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherModule = void 0;
const common_1 = require("@nestjs/common");
const teacher_service_1 = require("./teacher.service");
const teacher_controller_1 = require("./teacher.controller");
const typeorm_1 = require("@nestjs/typeorm");
const Teacher_1 = require("./entity/Teacher");
const users_module_1 = require("../users/users.module");
const types_module_1 = require("../types/types.module");
const certificate_entity_1 = require("../certificate/entities/certificate.entity");
const Article_1 = require("../article/entity/Article");
const Reel_1 = require("../reels/entity/Reel");
const course_entity_1 = require("../course/entities/course.entity");
const follower_entity_1 = require("../follower/entities/follower.entity");
const student_module_1 = require("../student/student.module");
const rate_module_1 = require("../rate/rate.module");
const coupon_entity_1 = require("../discounts/entities/coupon.entity");
let TeacherModule = class TeacherModule {
};
exports.TeacherModule = TeacherModule;
exports.TeacherModule = TeacherModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                certificate_entity_1.CertificateEntity,
                Teacher_1.TeacherEntity,
                Article_1.ArticleEntity,
                Reel_1.ReelEntity,
                course_entity_1.Course,
                follower_entity_1.Follower,
                coupon_entity_1.Coupon,
            ]),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            types_module_1.TypesModule,
            student_module_1.StudentModule,
            rate_module_1.RateModule,
        ],
        providers: [teacher_service_1.TeacherService],
        controllers: [teacher_controller_1.TeacherController],
        exports: [teacher_service_1.TeacherService],
    })
], TeacherModule);
//# sourceMappingURL=teacher.module.js.map