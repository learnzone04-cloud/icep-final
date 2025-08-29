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
exports.StatisticsController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_1 = require("../users/entity/User");
const Teacher_1 = require("../teacher/entity/Teacher");
const Reel_1 = require("../reels/entity/Reel");
const Article_1 = require("../article/entity/Article");
const ShortVideo_1 = require("../short-video/entity/ShortVideo");
const course_entity_1 = require("../course/entities/course.entity");
const EnrollCourseStudent_entity_1 = require("../enroll-course-student/entity/EnrollCourseStudent.entity");
const typeorm_3 = require("typeorm");
let StatisticsController = class StatisticsController {
    constructor(userRepo, teacherRepo, reelRepo, articleRepo, shortVideoRepo, courseRepo, enrollRepo) {
        this.userRepo = userRepo;
        this.teacherRepo = teacherRepo;
        this.reelRepo = reelRepo;
        this.articleRepo = articleRepo;
        this.shortVideoRepo = shortVideoRepo;
        this.courseRepo = courseRepo;
        this.enrollRepo = enrollRepo;
    }
    async getStudentsThisMonth() {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const count = await this.userRepo.count({
            where: {
                role: User_1.UserRole.Student,
                createdAt: (0, typeorm_3.MoreThanOrEqual)(firstDay),
            },
        });
        return { count };
    }
    async getTeachersThisMonth() {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const count = await this.userRepo.count({
            where: {
                role: User_1.UserRole.Teacher,
                createdAt: (0, typeorm_3.MoreThanOrEqual)(firstDay),
            },
        });
        return { count };
    }
    async getReelsThisMonth() {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const count = await this.reelRepo.count({
            where: { createdAt: (0, typeorm_3.MoreThanOrEqual)(firstDay) },
        });
        return { count };
    }
    async getArticlesThisMonth() {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const count = await this.articleRepo.count({
            where: { createdAt: (0, typeorm_3.MoreThanOrEqual)(firstDay) },
        });
        return { count };
    }
    async getShortVideosThisMonth() {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const count = await this.shortVideoRepo.count({
            where: { createdAt: (0, typeorm_3.MoreThanOrEqual)(firstDay) },
        });
        return { count };
    }
    async getTopCourses() {
        const result = await this.enrollRepo
            .createQueryBuilder('enroll')
            .select('enroll.courseId', 'courseId')
            .addSelect('COUNT(enroll.id)', 'enrollCount')
            .groupBy('enroll.courseId')
            .orderBy('enrollCount', 'DESC')
            .limit(5)
            .getRawMany();
        const courses = await Promise.all(result.map(async (row) => {
            const course = await this.courseRepo.findOne({ where: { id: row.courseId } });
            return { course, enrollCount: Number(row.enrollCount) };
        }));
        return courses;
    }
    async getMonthlyStudents() {
        const currentYear = new Date().getFullYear();
        const monthlyData = [];
        for (let month = 1; month <= 12; month++) {
            const firstDay = new Date(currentYear, month - 1, 1);
            const lastDay = new Date(currentYear, month, 0, 23, 59, 59, 999);
            const count = await this.userRepo.count({
                where: {
                    role: User_1.UserRole.Student,
                    createdAt: (0, typeorm_2.Between)(firstDay, lastDay),
                },
            });
            monthlyData.push({
                month: month,
                monthName: firstDay.toLocaleString('default', { month: 'long' }),
                year: currentYear,
                count: count
            });
        }
        return {
            year: currentYear,
            monthlyData: monthlyData
        };
    }
    async getMonthlyTeachers() {
        const currentYear = new Date().getFullYear();
        const monthlyData = [];
        for (let month = 1; month <= 12; month++) {
            const firstDay = new Date(currentYear, month - 1, 1);
            const lastDay = new Date(currentYear, month, 0, 23, 59, 59, 999);
            const count = await this.userRepo.count({
                where: {
                    role: User_1.UserRole.Teacher,
                    createdAt: (0, typeorm_2.Between)(firstDay, lastDay),
                },
            });
            monthlyData.push({
                month: month,
                monthName: firstDay.toLocaleString('default', { month: 'long' }),
                year: currentYear,
                count: count
            });
        }
        return {
            year: currentYear,
            monthlyData: monthlyData
        };
    }
    async getMonthlyReels() {
        const currentYear = new Date().getFullYear();
        const monthlyData = [];
        for (let month = 1; month <= 12; month++) {
            const firstDay = new Date(currentYear, month - 1, 1);
            const lastDay = new Date(currentYear, month, 0, 23, 59, 59, 999);
            const count = await this.reelRepo.count({
                where: {
                    createdAt: (0, typeorm_2.Between)(firstDay, lastDay),
                },
            });
            monthlyData.push({
                month: month,
                monthName: firstDay.toLocaleString('default', { month: 'long' }),
                year: currentYear,
                count: count
            });
        }
        return {
            year: currentYear,
            monthlyData: monthlyData
        };
    }
    async getMonthlyArticles() {
        const currentYear = new Date().getFullYear();
        const monthlyData = [];
        for (let month = 1; month <= 12; month++) {
            const firstDay = new Date(currentYear, month - 1, 1);
            const lastDay = new Date(currentYear, month, 0, 23, 59, 59, 999);
            const count = await this.articleRepo.count({
                where: {
                    createdAt: (0, typeorm_2.Between)(firstDay, lastDay),
                },
            });
            monthlyData.push({
                month: month,
                monthName: firstDay.toLocaleString('default', { month: 'long' }),
                year: currentYear,
                count: count
            });
        }
        return {
            year: currentYear,
            monthlyData: monthlyData
        };
    }
    async getMonthlyShortVideos() {
        const currentYear = new Date().getFullYear();
        const monthlyData = [];
        for (let month = 1; month <= 12; month++) {
            const firstDay = new Date(currentYear, month - 1, 1);
            const lastDay = new Date(currentYear, month, 0, 23, 59, 59, 999);
            const count = await this.shortVideoRepo.count({
                where: {
                    createdAt: (0, typeorm_2.Between)(firstDay, lastDay),
                },
            });
            monthlyData.push({
                month: month,
                monthName: firstDay.toLocaleString('default', { month: 'long' }),
                year: currentYear,
                count: count
            });
        }
        return {
            year: currentYear,
            monthlyData: monthlyData
        };
    }
    async getAllMonthlyStatistics() {
        const [students, teachers, reels, articles, shortVideos] = await Promise.all([
            this.getMonthlyStudents(),
            this.getMonthlyTeachers(),
            this.getMonthlyReels(),
            this.getMonthlyArticles(),
            this.getMonthlyShortVideos()
        ]);
        return {
            year: students.year,
            students: students.monthlyData,
            teachers: teachers.monthlyData,
            reels: reels.monthlyData,
            articles: articles.monthlyData,
            shortVideos: shortVideos.monthlyData
        };
    }
};
exports.StatisticsController = StatisticsController;
__decorate([
    (0, common_1.Get)('students-this-month'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getStudentsThisMonth", null);
__decorate([
    (0, common_1.Get)('teachers-this-month'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeachersThisMonth", null);
__decorate([
    (0, common_1.Get)('reels-this-month'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getReelsThisMonth", null);
__decorate([
    (0, common_1.Get)('articles-this-month'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getArticlesThisMonth", null);
__decorate([
    (0, common_1.Get)('short-videos-this-month'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getShortVideosThisMonth", null);
__decorate([
    (0, common_1.Get)('top-courses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTopCourses", null);
__decorate([
    (0, common_1.Get)('monthly/students'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getMonthlyStudents", null);
__decorate([
    (0, common_1.Get)('monthly/teachers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getMonthlyTeachers", null);
__decorate([
    (0, common_1.Get)('monthly/reels'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getMonthlyReels", null);
__decorate([
    (0, common_1.Get)('monthly/articles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getMonthlyArticles", null);
__decorate([
    (0, common_1.Get)('monthly/short-videos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getMonthlyShortVideos", null);
__decorate([
    (0, common_1.Get)('monthly/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getAllMonthlyStatistics", null);
exports.StatisticsController = StatisticsController = __decorate([
    (0, common_1.Controller)('statistics'),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(Teacher_1.TeacherEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(Reel_1.ReelEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(Article_1.ArticleEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(ShortVideo_1.ShortVideoEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(6, (0, typeorm_1.InjectRepository)(EnrollCourseStudent_entity_1.EnrollCourseStudent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StatisticsController);
//# sourceMappingURL=statistics.controller.js.map