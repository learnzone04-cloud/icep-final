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
exports.StudentType = void 0;
const Student_1 = require("../../student/entity/Student");
const Type_1 = require("../../types/entity/Type");
const typeorm_1 = require("typeorm");
let StudentType = class StudentType {
};
exports.StudentType = StudentType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StudentType.prototype, "StudentTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], StudentType.prototype, "typeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], StudentType.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Type_1.TypeEntity, (type) => type.studentTypes),
    (0, typeorm_1.JoinColumn)({ name: 'typeId' }),
    __metadata("design:type", Type_1.TypeEntity)
], StudentType.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Student_1.Student, (student) => student.studentTypes),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", Student_1.Student)
], StudentType.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StudentType.prototype, "level", void 0);
exports.StudentType = StudentType = __decorate([
    (0, typeorm_1.Entity)()
], StudentType);
//# sourceMappingURL=StudentType.js.map