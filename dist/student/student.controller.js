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
exports.StudentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const student_service_1 = require("./student.service");
const jwt_1 = require("@nestjs/jwt");
const types_service_1 = require("../types/types.service");
const notes_service_1 = require("../notes/notes.service");
let StudentController = class StudentController {
    constructor(studentService, jwtService, typesService, notesService) {
        this.studentService = studentService;
        this.jwtService = jwtService;
        this.typesService = typesService;
        this.notesService = notesService;
    }
    async completeProfile(req, body) {
        const userId = req.user.id;
        const { work, typeId } = body;
        await this.studentService.updateProfile(userId, { work });
        await this.studentService.addTypeIfNotExists(userId, typeId);
        const type = await this.typesService.findOneById(typeId);
        const student = await this.studentService.findOneByUserId(userId);
        if (!student) {
            throw new Error(`Student not found for userId: ${userId}`);
        }
        const payload = {
            id: userId,
            role: req.user.role,
            typeId: type.id,
            typeName: type.name,
            name: req.user.name,
            studentId: student.id,
        };
        const token = this.jwtService.sign(payload);
        console.log('Creating note for student:', student.id);
        await this.notesService.createNote(student.id, 'initial note');
        return { token };
    }
    async getMyIds(req) {
        const senderId = req.user.id;
        let studentId = null;
        if (req.user.role === 'Student') {
            studentId = await this.studentService.getStudentIdByUserId(senderId);
        }
        return { senderId, studentId };
    }
};
exports.StudentController = StudentController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "completeProfile", null);
__decorate([
    (0, common_1.Get)('my-ids'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "getMyIds", null);
exports.StudentController = StudentController = __decorate([
    (0, common_1.Controller)('student'),
    __metadata("design:paramtypes", [student_service_1.StudentService,
        jwt_1.JwtService,
        types_service_1.TypesService,
        notes_service_1.NotesService])
], StudentController);
//# sourceMappingURL=student.controller.js.map