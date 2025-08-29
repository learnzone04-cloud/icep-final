"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const common_1 = require("@nestjs/common");
const course_service_1 = require("./course.service");
const create_course_dto_1 = require("./dto/create-course.dto");
const update_course_dto_1 = require("./dto/update-course.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const course_entity_1 = require("./entities/course.entity");
const course_video_entity_1 = require("../course-video/entity/course-video.entity");
const Teacher_1 = require("../teacher/entity/Teacher");
const User_1 = require("../users/entity/User");
let CourseController = class CourseController {
    constructor(courseService, courseRepo, videoRepo, teacherRepo, userRepo) {
        this.courseService = courseService;
        this.courseRepo = courseRepo;
        this.videoRepo = videoRepo;
        this.teacherRepo = teacherRepo;
        this.userRepo = userRepo;
    }
    create(createCourseDto, req) {
        return this.courseService.create(req.user.id, createCourseDto);
    }
    findAll(req) {
        return this.courseService.findByUserType(req.user);
    }
    async getUnapprovedVideosGroupedByCourse() {
        const videos = await this.videoRepo.find({ where: { approaved: false }, relations: ['course'] });
        const grouped = {};
        for (const video of videos) {
            const course = await this.courseRepo.findOne({ where: { id: video.courseId }, relations: ['teacher'] });
            if (!course)
                continue;
            const teacher = await this.teacherRepo.findOne({ where: { id: course.teacherId }, relations: ['user'] });
            const teacherName = teacher && teacher.user ? `${teacher.user.fName} ${teacher.user.lName}` : '';
            if (!grouped[course.id]) {
                grouped[course.id] = {
                    courseId: course.id,
                    courseTitle: course.title,
                    teacherName,
                    videos: [],
                };
            }
            grouped[course.id].videos.push(video);
        }
        return Object.values(grouped);
    }
    findOne(id) {
        return this.courseService.findOne(+id);
    }
    update(id, updateCourseDto) {
        return this.courseService.update(+id, updateCourseDto);
    }
    remove(id) {
        return this.courseService.delete(+id);
    }
};
exports.CourseController = CourseController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto, Object]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unapproved-videos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getUnapprovedVideosGroupedByCourse", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_course_dto_1.UpdateCourseDto]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "remove", null);
exports.CourseController = CourseController = __decorate([
    (0, common_1.Controller)('course'),
    __param(1, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(2, (0, typeorm_1.InjectRepository)(course_video_entity_1.CourseVideoEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(Teacher_1.TeacherEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(User_1.UserEntity)),
    __metadata("design:paramtypes", [course_service_1.CourseService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CourseController);
//# sourceMappingURL=course.controller.js.map