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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Teacher_1 = require("../teacher/entity/Teacher");
const course_entity_1 = require("../course/entities/course.entity");
let SearchService = class SearchService {
    constructor(teacherRepo, courseRepo) {
        this.teacherRepo = teacherRepo;
        this.courseRepo = courseRepo;
    }
    async searchAll(name, user) {
        const searchTerm = name?.toLowerCase() || '';
        const typeFilter = user.role === 'Student' ? { typeId: user.typeId } : {};
        const teacherQuery = this.teacherRepo
            .createQueryBuilder('teacher')
            .leftJoinAndSelect('teacher.user', 'user')
            .where('LOWER(CONCAT(user.fName, " ", user.lName)) LIKE :name', { name: `%${searchTerm}%` });
        if (user.role === 'Student') {
            teacherQuery.andWhere('teacher.typeId = :typeId', { typeId: user.typeId });
        }
        const teachers = await teacherQuery.getMany();
        const courseQuery = this.courseRepo
            .createQueryBuilder('course')
            .where('LOWER(course.title) LIKE :name', { name: `%${searchTerm}%` });
        if (user.role === 'Student') {
            courseQuery.andWhere('course.typeId = :typeId', { typeId: user.typeId });
        }
        const courses = await courseQuery.getMany();
        const teacherResults = teachers.map(t => ({
            id: t.id,
            name: t.user ? `${t.user.fName} ${t.user.lName}` : '',
            type: 'teacher',
        }));
        const courseResults = courses.map(c => ({
            id: c.id,
            name: c.title,
            type: 'course',
        }));
        return [...teacherResults, ...courseResults];
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Teacher_1.TeacherEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SearchService);
//# sourceMappingURL=search.service.js.map