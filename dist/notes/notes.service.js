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
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Note_1 = require("./entity/Note");
const NoteContext_1 = require("./entity/NoteContext");
let NotesService = class NotesService {
    constructor(noteRepo, noteContextRepo) {
        this.noteRepo = noteRepo;
        this.noteContextRepo = noteContextRepo;
    }
    async createNote(studentId, title = 'initial note') {
        const note = this.noteRepo.create({ studentId, title });
        return this.noteRepo.save(note);
    }
    async createNoteContext(noteId, context, videoId) {
        const noteContext = this.noteContextRepo.create({ noteId, context, videoId });
        return this.noteContextRepo.save(noteContext);
    }
    async getNotesForStudent(studentId) {
        return this.noteRepo.find({
            where: { studentId },
            relations: ['noteContexts'],
        });
    }
    async deleteNote(noteId) {
        return this.noteRepo.delete(noteId);
    }
    async editNote(noteId, title) {
        await this.noteRepo.update(noteId, { title });
        return this.noteRepo.findOne({ where: { id: noteId }, relations: ['noteContexts'] });
    }
    async editNoteContext(contextId, context) {
        await this.noteContextRepo.update(contextId, { context });
        return this.noteContextRepo.findOne({ where: { id: contextId } });
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Note_1.Note)),
    __param(1, (0, typeorm_1.InjectRepository)(NoteContext_1.NoteContext)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], NotesService);
//# sourceMappingURL=notes.service.js.map