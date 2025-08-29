"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lesson_controller_1 = require("./lesson.controller");
const lesson_service_1 = require("./lesson.service");
const Lesson_1 = require("./entity/Lesson");
const LessonReschedule_1 = require("./entity/LessonReschedule");
const User_1 = require("../users/entity/User");
const admin_auth_module_1 = require("../admin-auth/admin-auth.module");
const lesson_scheduler_service_1 = require("./lesson-scheduler.service");
const google_calendar_module_1 = require("../google-calendar.module");
let LessonModule = class LessonModule {
};
exports.LessonModule = LessonModule;
exports.LessonModule = LessonModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Lesson_1.Lesson,
                LessonReschedule_1.LessonReschedule,
                User_1.UserEntity,
            ]),
            admin_auth_module_1.AdminAuthModule,
            google_calendar_module_1.GoogleCalendarModule,
        ],
        controllers: [lesson_controller_1.LessonController],
        providers: [lesson_service_1.LessonService, lesson_scheduler_service_1.LessonSchedulerService],
        exports: [lesson_service_1.LessonService],
    })
], LessonModule);
//# sourceMappingURL=lesson.module.js.map