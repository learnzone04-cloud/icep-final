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
exports.Follower = void 0;
const Student_1 = require("../../student/entity/Student");
const Teacher_1 = require("../../teacher/entity/Teacher");
const typeorm_1 = require("typeorm");
let Follower = class Follower {
};
exports.Follower = Follower;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Follower.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Follower.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Follower.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Teacher_1.TeacherEntity, (teacher) => teacher.followers),
    (0, typeorm_1.JoinColumn)({ name: 'teacherId' }),
    __metadata("design:type", Teacher_1.TeacherEntity)
], Follower.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Student_1.Student, (student) => student.followers),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", Student_1.Student)
], Follower.prototype, "student", void 0);
exports.Follower = Follower = __decorate([
    (0, typeorm_1.Entity)()
], Follower);
//# sourceMappingURL=follower.entity.js.map