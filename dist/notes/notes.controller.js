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
exports.NotesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const notes_service_1 = require("./notes.service");
const student_service_1 = require("../student/student.service");
let NotesController = class NotesController {
    constructor(notesService, studentService) {
        this.notesService = notesService;
        this.studentService = studentService;
    }
    async createNote(req, title) {
        const userId = req.user.id;
        const student = await this.studentService.findOneByUserId(userId);
        if (!student) {
            throw new Error(`Student not found for userId: ${userId}`);
        }
        return this.notesService.createNote(student.id, title || 'initial note');
    }
    async createNoteContext(noteId, context, videoId) {
        return this.notesService.createNoteContext(noteId, context, videoId);
    }
    async getNotes(req) {
        const userId = req.user.id;
        const student = await this.studentService.findOneByUserId(userId);
        if (!student) {
            throw new Error(`Student not found for userId: ${userId}`);
        }
        return this.notesService.getNotesForStudent(student.id);
    }
    async deleteNote(noteId) {
        return this.notesService.deleteNote(noteId);
    }
    async editNote(noteId, title) {
        return this.notesService.editNote(noteId, title);
    }
    async editNoteContext(contextId, context) {
        return this.notesService.editNoteContext(contextId, context);
    }
};
exports.NotesController = NotesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "createNote", null);
__decorate([
    (0, common_1.Post)(':noteId/context'),
    __param(0, (0, common_1.Param)('noteId')),
    __param(1, (0, common_1.Body)('context')),
    __param(2, (0, common_1.Body)('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "createNoteContext", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "getNotes", null);
__decorate([
    (0, common_1.Delete)(':noteId'),
    __param(0, (0, common_1.Param)('noteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "deleteNote", null);
__decorate([
    (0, common_1.Patch)(':noteId'),
    __param(0, (0, common_1.Param)('noteId')),
    __param(1, (0, common_1.Body)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "editNote", null);
__decorate([
    (0, common_1.Patch)('context/:contextId'),
    __param(0, (0, common_1.Param)('contextId')),
    __param(1, (0, common_1.Body)('context')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "editNoteContext", null);
exports.NotesController = NotesController = __decorate([
    (0, common_1.Controller)('notes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [notes_service_1.NotesService,
        student_service_1.StudentService])
], NotesController);
//# sourceMappingURL=notes.controller.js.map