"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentTypeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const StudentType_1 = require("./entity/StudentType");
const student_type_controller_1 = require("./student-type.controller");
const student_module_1 = require("../student/student.module");
const Student_1 = require("../student/entity/Student");
let StudentTypeModule = class StudentTypeModule {
};
exports.StudentTypeModule = StudentTypeModule;
exports.StudentTypeModule = StudentTypeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([StudentType_1.StudentType, Student_1.Student]), student_module_1.StudentModule],
        controllers: [student_type_controller_1.StudentTypeController],
        providers: [],
        exports: [],
    })
], StudentTypeModule);
//# sourceMappingURL=student-type.module.js.map