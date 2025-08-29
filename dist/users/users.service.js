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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("./entity/User");
const Teacher_1 = require("../teacher/entity/Teacher");
const certificate_entity_1 = require("../certificate/entities/certificate.entity");
const typeorm_2 = require("typeorm");
let UsersService = class UsersService {
    constructor(userRepo, teacherRepo, certificateRepo) {
        this.userRepo = userRepo;
        this.teacherRepo = teacherRepo;
        this.certificateRepo = certificateRepo;
    }
    createUser(data) {
        const user = this.userRepo.create(data);
        return this.userRepo.save(user);
    }
    find() {
        return this.userRepo.find();
    }
    findOne(email) {
        if (!email) {
            return null;
        }
        return this.userRepo.findOne({
            where: { email: email },
        });
    }
    async findTeacherRequest() {
        const users = await this.userRepo.find({
            relations: ['teacher', 'teacher.certificate'],
        });
        return users.filter((user) => user.role === 'Teacher' && user.active === false);
    }
    async findPendingTeacherRequests() {
        const users = await this.userRepo.find({
            relations: ['teacher'],
            where: {
                role: User_1.UserRole.Teacher,
                active: false
            }
        });
        const pendingTeachers = users.filter(user => user.teacher);
        return pendingTeachers.map(user => ({
            id: user.id,
            name: `${user.fName} ${user.lName}`,
            email: user.email,
            teacherCreatedAt: user.teacher.createdAt,
            phoneNumber: user.phoneNumber
        }));
    }
    async findApprovedTeachers() {
        const users = await this.userRepo.find({
            relations: ['teacher'],
            where: {
                role: User_1.UserRole.Teacher,
                active: true
            }
        });
        const approvedTeachers = users.filter(user => user.teacher);
        return approvedTeachers.map(user => ({
            id: user.id,
            name: `${user.fName} ${user.lName}`,
            email: user.email,
            teacherCreatedAt: user.teacher.createdAt,
            phoneNumber: user.phoneNumber
        }));
    }
    async findAllStudentsOrderedByType() {
        const users = await this.userRepo.find({
            relations: ['student', 'student.studentTypes', 'student.studentTypes.type'],
            where: {
                role: User_1.UserRole.Student,
                active: true
            }
        });
        const students = users.filter(user => user.student);
        const studentsWithTypes = students.map(user => ({
            id: user.id,
            name: `${user.fName} ${user.lName}`,
            email: user.email,
            phoneNumber: user.phoneNumber,
            studentCreatedAt: user.createdAt,
            types: user.student.studentTypes.map(studentType => ({
                typeId: studentType.type.id,
                typeName: studentType.type.name
            }))
        }));
        const singleTypeStudents = studentsWithTypes.filter(student => student.types.length === 1);
        const multipleTypeStudents = studentsWithTypes.filter(student => student.types.length > 1);
        const studentsByType = {};
        singleTypeStudents.forEach(student => {
            const typeName = student.types[0].typeName;
            if (!studentsByType[typeName]) {
                studentsByType[typeName] = [];
            }
            studentsByType[typeName].push(student);
        });
        Object.keys(studentsByType).forEach(typeName => {
            studentsByType[typeName].sort((a, b) => a.name.localeCompare(b.name));
        });
        multipleTypeStudents.sort((a, b) => a.name.localeCompare(b.name));
        return {
            studentsByType,
            multipleTypeStudents
        };
    }
    async findTeacherById(userId) {
        const user = await this.userRepo.findOne({
            relations: ['teacher', 'teacher.certificate'],
            where: {
                id: userId,
                role: User_1.UserRole.Teacher
            }
        });
        if (!user || !user.teacher) {
            return null;
        }
        return {
            id: user.id,
            fName: user.fName,
            lName: user.lName,
            phoneNumber: user.phoneNumber,
            active: user.active,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            teacher: {
                id: user.teacher.id,
                facebookUrl: user.teacher.facebookUrl,
                instagramUrl: user.teacher.instagramUrl,
                coverLetter: user.teacher.coverLetter,
                cv: user.teacher.cv,
                userId: user.teacher.userId,
                typeId: user.teacher.typeId,
                createdAt: user.teacher.createdAt,
                certificate: user.teacher.certificate || []
            }
        };
    }
    findOneById(id) {
        if (!id) {
            return null;
        }
        return this.userRepo.findOne({
            where: { id: id },
            relations: [
                'teacher',
                'teacher.type',
                'student',
                'student.notes',
                'student.words',
                'student.studentTypes',
            ],
        });
    }
    async delete(id) {
        const findUser = await this.findOneById(id);
        if (!findUser)
            throw new common_1.NotFoundException('User Not Found');
        return this.userRepo.remove(findUser);
    }
    async update(id, data) {
        const findUser = await this.findOneById(id);
        if (!findUser)
            throw new common_1.NotFoundException('User Not Found');
        Object.assign(findUser, data);
        return this.userRepo.save(findUser);
    }
    async deleteTeacherRecord(teacherId) {
        const certificates = await this.certificateRepo.find({ where: { teacherId } });
        if (certificates.length > 0) {
            await this.certificateRepo.remove(certificates);
        }
        const teacher = await this.teacherRepo.findOne({ where: { id: teacherId } });
        if (teacher) {
            return this.teacherRepo.remove(teacher);
        }
        return null;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(Teacher_1.TeacherEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(certificate_entity_1.CertificateEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map