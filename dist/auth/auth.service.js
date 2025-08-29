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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const users_service_1 = require("../users/users.service");
const util_1 = require("util");
const types_service_1 = require("../types/types.service");
const student_service_1 = require("../student/student.service");
const teacher_service_1 = require("../teacher/teacher.service");
const scrypt = (0, util_1.promisify)(crypto_1.scrypt);
let AuthService = class AuthService {
    constructor(userService, jwtService, typesService, studentService, teacherService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.typesService = typesService;
        this.studentService = studentService;
        this.teacherService = teacherService;
    }
    async validateUser(email) {
        const user = await this.userService.findOne(email);
        if (user) {
            const { password, ...rest } = user;
            return rest;
        }
        return null;
    }
    async login(data) {
        const user = await this.userService.findOne(data.email);
        if (!user) {
            throw new common_1.NotFoundException('User Not Found');
        }
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(data.password, salt, 32));
        if (storedHash !== hash.toString('hex')) {
            throw new common_1.BadRequestException('bad password');
        }
        if (!user.active) {
            throw new common_1.NotFoundException('User Can not Sing in');
        }
        let typeId = data.typeId;
        let typeName = undefined;
        let studentId = undefined;
        let teacherId = undefined;
        if (user.role === 'Student') {
            if (!typeId) {
                throw new common_1.BadRequestException('typeId is required for students');
            }
            await this.studentService.addTypeIfNotExists(user.id, typeId);
            const type = await this.typesService.findOneById(typeId);
            typeName = type?.name;
            const student = await this.studentService.findOneByUserId(user.id);
            studentId = student?.id;
        }
        else if (user.role === 'Teacher') {
            const teacher = await this.teacherService.findOneByUser(user.id);
            teacherId = teacher?.id;
        }
        const { password, ...returnData } = user;
        const payload = {
            name: `${user.fName}  ${user.lName}`,
            id: user.id,
            role: user.role,
        };
        if (typeId && typeName) {
            payload.typeId = typeId;
            payload.typeName = typeName;
        }
        if (studentId) {
            payload.studentId = studentId;
        }
        if (teacherId) {
            payload.teacherId = teacherId;
        }
        return {
            ...returnData,
            accessToken: this.jwtService.sign(payload),
            studentId: studentId,
            teacherId: teacherId,
        };
    }
    async register(data) {
        if (data.role === 'Teacher') {
            data.active = false;
        }
        const salt = (0, crypto_1.randomBytes)(8).toString('hex');
        const hash = (await scrypt(data.password, salt, 32));
        const result = salt + '.' + hash.toString('hex');
        data.password = result;
        const user = await this.userService.createUser(data);
        if (user.role === 'Student') {
            await this.studentService.createStudentForUser(user.id);
        }
        let typeId = data.typeId;
        let typeName = undefined;
        if (user.role === 'Student' && typeId) {
            await this.studentService.addTypeIfNotExists(user.id, typeId);
            const type = await this.typesService.findOneById(typeId);
            typeName = type?.name;
        }
        const { password, ...returnData } = user;
        const payload = {
            name: `${user.fName}  ${user.lName}`,
            id: user.id,
            role: user.role,
        };
        if (typeId && typeName) {
            payload.typeId = typeId;
            payload.typeName = typeName;
        }
        return {
            ...returnData,
            accessToken: this.jwtService.sign(payload),
        };
    }
    getProfile(id) {
        return this.userService.findOneById(id);
    }
    async update(id, data) {
        if (data.password) {
            const salt = (0, crypto_1.randomBytes)(8).toString('hex');
            const hash = (await scrypt(data.password, salt, 32));
            const result = salt + '.' + hash.toString('hex');
            data.password = result;
        }
        return await this.userService.update(id, data);
    }
    async delete(id) {
        return await this.userService.delete(id);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        types_service_1.TypesService,
        student_service_1.StudentService,
        teacher_service_1.TeacherService])
], AuthService);
//# sourceMappingURL=auth.service.js.map