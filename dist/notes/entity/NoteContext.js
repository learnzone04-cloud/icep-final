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
exports.NoteContext = void 0;
const typeorm_1 = require("typeorm");
const Note_1 = require("./Note");
let NoteContext = class NoteContext {
};
exports.NoteContext = NoteContext;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], NoteContext.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], NoteContext.prototype, "noteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Note_1.Note, (note) => note.noteContexts, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'noteId' }),
    __metadata("design:type", Note_1.Note)
], NoteContext.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], NoteContext.prototype, "context", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], NoteContext.prototype, "videoId", void 0);
exports.NoteContext = NoteContext = __decorate([
    (0, typeorm_1.Entity)()
], NoteContext);
//# sourceMappingURL=NoteContext.js.map