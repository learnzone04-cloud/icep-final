"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const student_service_1 = require("./student.service");
const student_controller_1 = require("./student.controller");
const Student_1 = require("./entity/Student");
const typeorm_1 = require("@nestjs/typeorm");
const StudentType_1 = require("../student-type/entity/StudentType");
const Type_1 = require("../types/entity/Type");
const users_module_1 = require("../users/users.module");
const types_module_1 = require("../types/types.module");
const jwt_1 = require("@nestjs/jwt");
const notes_module_1 = require("../notes/notes.module");
let StudentModule = class StudentModule {
};
exports.StudentModule = StudentModule;
exports.StudentModule = StudentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([Student_1.Student, StudentType_1.StudentType, Type_1.TypeEntity]),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            types_module_1.TypesModule,
            (0, common_1.forwardRef)(() => notes_module_1.NotesModule),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '50000000s' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [student_service_1.StudentService],
        controllers: [student_controller_1.StudentController],
        exports: [student_service_1.StudentService],
    })
], StudentModule);
//# sourceMappingURL=student.module.js.map