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
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const course_entity_1 = require("./entities/course.entity");
const typeorm_2 = require("typeorm");
const teacher_service_1 = require("../teacher/teacher.service");
const types_service_1 = require("../types/types.service");
const notification_service_1 = require("../notification/notification.service");
const discounts_service_1 = require("../discounts/discounts.service");
let CourseService = class CourseService {
    constructor(repo, teacherService, typeService, notificationService, discountsService) {
        this.repo = repo;
        this.teacherService = teacherService;
        this.typeService = typeService;
        this.notificationService = notificationService;
        this.discountsService = discountsService;
    }
    async create(userId, data) {
        const teacher = await this.teacherService.findOneByUser(userId);
        const type = await this.typeService.findOneById(data.typeId);
        data.teacherId = teacher.id;
        const course = this.repo.create(data);
        course.teacher = teacher;
        course.type = type;
        if (data.level) {
            course.level = data.level;
        }
        if (data.passGrade !== undefined && data.passGrade !== null) {
            if (data.passGrade <= 10 || data.passGrade >= 80) {
                throw new Error('passGrade must be greater than 10 and less than 80');
            }
            course.passGrade = data.passGrade;
        }
        if (data.hasPassFailSystem !== undefined) {
            course.hasPassFailSystem = data.hasPassFailSystem;
        }
        const savedCourse = await this.repo.save(course);
        try {
            const teacherName = `${teacher.user.fName} ${teacher.user.lName}`;
            await this.notificationService.sendCourseCreatedNotification(teacher.id, teacherName, savedCourse.id, savedCourse.title);
        }
        catch (error) {
            console.error('Failed to send course notification:', error);
        }
        return savedCourse;
    }
    async find() {
        const courses = await this.repo
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .leftJoinAndSelect('course.type', 'type')
            .where(qb => {
            const subQuery = qb
                .subQuery()
                .select('COUNT(cv.id)')
                .from('course_video_entity', 'cv')
                .where('cv.courseId = course.id')
                .andWhere('cv.approaved = true')
                .getQuery();
            return 'EXISTS (SELECT 1 WHERE ' + subQuery + ' >= course.videosNumber)';
        })
            .getMany();
        const enrichedCourses = await Promise.all(courses.map(course => this.discountsService.enrichCourseWithDiscount(course)));
        return enrichedCourses;
    }
    async findByUserType(user) {
        console.log('User from JWT:', user);
        console.log('User role:', user.role);
        console.log('User typeId:', user.typeId);
        if (user.role === 'Teacher') {
            console.log('Filtering courses for teacher with userId:', user.id);
            const teacher = await this.teacherService.findOneByUser(user.id);
            if (teacher) {
                const teacherCourses = await this.repo
                    .createQueryBuilder('course')
                    .leftJoinAndSelect('course.teacher', 'teacher')
                    .leftJoinAndSelect('course.type', 'type')
                    .where('course.teacherId = :teacherId', { teacherId: teacher.id })
                    .getMany();
                console.log('Found teacher courses:', teacherCourses.map(c => ({ id: c.id, teacherId: c.teacherId, title: c.title })));
                const enrichedCourses = await Promise.all(teacherCourses.map(course => this.discountsService.enrichCourseWithDiscount(course)));
                return enrichedCourses;
            }
            else {
                return [];
            }
        }
        let queryBuilder = this.repo
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .leftJoinAndSelect('course.type', 'type')
            .where(qb => {
            const subQuery = qb
                .subQuery()
                .select('COUNT(cv.id)')
                .from('course_video_entity', 'cv')
                .where('cv.courseId = course.id')
                .andWhere('cv.approaved = true')
                .getQuery();
            return 'EXISTS (SELECT 1 WHERE ' + subQuery + ' >= course.videosNumber)';
        });
        if (user.role === 'Student' && user.typeId) {
            console.log('Filtering courses for student with typeId:', user.typeId);
            queryBuilder = queryBuilder.andWhere('course.typeId = :typeId', { typeId: user.typeId });
        }
        const courses = await queryBuilder.getMany();
        if (user.role === 'Student' && user.typeId) {
            console.log('Found courses for student:', courses.map(c => ({ id: c.id, typeId: c.typeId, title: c.title })));
        }
        const enrichedCourses = await Promise.all(courses.map(course => this.discountsService.enrichCourseWithDiscount(course)));
        return enrichedCourses;
    }
    async findOne(id) {
        const course = await this.repo.findOne({
            where: { id: id }
        });
        if (!course) {
            return null;
        }
        return this.discountsService.enrichCourseWithDiscount(course);
    }
    async delete(id) {
        const course = await this.findOne(id);
        if (!course) {
            throw new Error('Course not found');
        }
        return this.repo.remove(course);
    }
    async update(id, data) {
        const course = await this.findOne(id);
        if (!course) {
            throw new Error('Course not found');
        }
        Object.assign(course, data);
        if (data.level !== undefined) {
            course.level = data.level;
        }
        if (data.passGrade !== undefined) {
            if (data.passGrade !== null && (data.passGrade < 60 || data.passGrade >= 80)) {
                throw new Error('passGrade must be greater than 60 and less than 80');
            }
            course.passGrade = data.passGrade;
        }
        if (data.hasPassFailSystem !== undefined) {
            course.hasPassFailSystem = data.hasPassFailSystem;
        }
        return this.repo.save(course);
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        teacher_service_1.TeacherService,
        types_service_1.TypesService,
        notification_service_1.NotificationService,
        discounts_service_1.DiscountsService])
], CourseService);
//# sourceMappingURL=course.service.js.map