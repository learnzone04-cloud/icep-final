"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("./entity/User");
const Teacher_1 = require("../teacher/entity/Teacher");
const certificate_entity_1 = require("../certificate/entities/certificate.entity");
const auth_module_1 = require("../auth/auth.module");
const admin_auth_module_1 = require("../admin-auth/admin-auth.module");
const gmail_module_1 = require("../gmail/gmail.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([User_1.UserEntity, Teacher_1.TeacherEntity, certificate_entity_1.CertificateEntity]), (0, common_1.forwardRef)(() => auth_module_1.AuthModule), admin_auth_module_1.AdminAuthModule, gmail_module_1.GmailModule],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map