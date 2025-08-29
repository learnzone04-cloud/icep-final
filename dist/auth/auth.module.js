"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const local_strategy_1 = require("./local.strategy");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("./jwt.strategy");
const session_serializer_1 = require("./session.serializer");
const users_module_1 = require("../users/users.module");
const student_type_module_1 = require("../student-type/student-type.module");
const types_module_1 = require("../types/types.module");
const student_module_1 = require("../student/student.module");
const teacher_module_1 = require("../teacher/teacher.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '50000000s' },
                }),
                inject: [config_1.ConfigService],
            }),
            student_type_module_1.StudentTypeModule,
            types_module_1.TypesModule,
            student_module_1.StudentModule,
            (0, common_1.forwardRef)(() => teacher_module_1.TeacherModule),
        ],
        providers: [
            auth_service_1.AuthService,
            local_strategy_1.LocalStrategy,
            jwt_strategy_1.JwtStrategy,
            session_serializer_1.SessionSerializer,
            {
                provide: 'AUTH_SERVICE',
                useClass: auth_service_1.AuthService,
            },
        ],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map