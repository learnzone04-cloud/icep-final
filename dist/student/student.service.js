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
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_service_1 = require("../users/users.service");
const typeorm_2 = require("typeorm");
const Student_1 = require("./entity/Student");
const StudentType_1 = require("../student-type/entity/StudentType");
const Type_1 = require("../types/entity/Type");
const types_service_1 = require("../types/types.service");
let StudentService = class StudentService {
    constructor(repo, userService, studentTypeRepo, typeRepo, typesService) {
        this.repo = repo;
        this.userService = userService;
        this.studentTypeRepo = studentTypeRepo;
        this.typeRepo = typeRepo;
        this.typesService = typesService;
    }
    async createTeacher(id, data) {
        const user = await this.userService.findOneById(id);
        const teacher = this.repo.create(data);
        teacher.user = user;
        return this.repo.save(teacher);
    }
    find() {
        return this.repo.find();
    }
    findOneByUserId(id) {
        return this.repo.findOne({
            where: { userId: id },
            relations: ['user'],
        });
    }
    findOneById(id) {
        return this.repo.findOne({
            where: { id: id },
            relations: ['user'],
        });
    }
    async delete(id) {
        const findTeacher = await this.findOneById(id);
        if (!findTeacher)
            throw new common_1.NotFoundException('Teacher Not Found');
        return this.repo.remove(findTeacher);
    }
    async update(id, data) {
        const findTeacher = await this.findOneById(id);
        if (!findTeacher)
            throw new common_1.NotFoundException('Teacher Not Found');
        Object.assign(findTeacher, data);
        return this.repo.save(findTeacher);
    }
    async createStudentForUser(userId) {
        const student = this.repo.create({ userId });
        return this.repo.save(student);
    }
    async updateProfile(userId, data) {
        const student = await this.findOneByUserId(userId);
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        Object.assign(student, data);
        return this.repo.save(student);
    }
    async addTypeIfNotExists(userId, typeId) {
        const student = await this.findOneByUserId(userId);
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        let studentType = await this.studentTypeRepo.findOne({ where: { studentId: student.id, typeId } });
        if (!studentType) {
            studentType = this.studentTypeRepo.create({ studentId: student.id, typeId });
            await this.studentTypeRepo.save(studentType);
        }
        return studentType;
    }
    async getStudentIdByUserId(userId) {
        const student = await this.findOneByUserId(userId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found for this user');
        }
        return student.id;
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Student_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(StudentType_1.StudentType)),
    __param(3, (0, typeorm_1.InjectRepository)(Type_1.TypeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        types_service_1.TypesService])
], StudentService);
//# sourceMappingURL=student.service.js.map