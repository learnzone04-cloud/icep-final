"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const Story_1 = require("./entity/Story");
const StoryLike_1 = require("./entity/StoryLike");
const story_service_1 = require("./story.service");
const story_controller_1 = require("./story.controller");
const Teacher_1 = require("../teacher/entity/Teacher");
const Student_1 = require("../student/entity/Student");
const follower_entity_1 = require("../follower/entities/follower.entity");
const story_gateway_1 = require("./story.gateway");
const follower_service_1 = require("../follower/follower.service");
const auth_module_1 = require("../auth/auth.module");
const student_module_1 = require("../student/student.module");
const teacher_module_1 = require("../teacher/teacher.module");
let StoryModule = class StoryModule {
};
exports.StoryModule = StoryModule;
exports.StoryModule = StoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Story_1.Story,
                StoryLike_1.StoryLike,
                Teacher_1.TeacherEntity,
                Student_1.Student,
                follower_entity_1.Follower,
            ]),
            platform_express_1.MulterModule.register({
                dest: './uploads/stories',
            }),
            auth_module_1.AuthModule,
            student_module_1.StudentModule,
            teacher_module_1.TeacherModule,
        ],
        providers: [story_service_1.StoryService, story_gateway_1.StoryGateway, follower_service_1.FollowerService],
        controllers: [story_controller_1.StoryController],
        exports: [story_service_1.StoryService],
    })
], StoryModule);
//# sourceMappingURL=story.module.js.map