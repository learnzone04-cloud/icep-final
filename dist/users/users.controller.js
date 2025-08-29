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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const create_user_dto_1 = require("./dtos/create-user.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_auth_guard_1 = require("../admin-auth/admin-auth.guard");
const update_user_dto_1 = require("./dtos/update-user.dto");
const users_service_1 = require("./users.service");
const gmail_service_1 = require("../gmail/gmail.service");
const admin_auth_service_1 = require("../admin-auth/admin-auth.service");
let UsersController = class UsersController {
    constructor(authService, userService, gmailService, adminAuthService) {
        this.authService = authService;
        this.userService = userService;
        this.gmailService = gmailService;
        this.adminAuthService = adminAuthService;
    }
    user(req) {
        console.log(req.user);
        if (req.user) {
            return {
                msg: 'Authenticated',
            };
        }
        else {
            return {
                msg: 'Unt Authenticated',
            };
        }
    }
    login(req) {
        return this.authService.login(req.body);
    }
    register(req, createUserDto) {
        return this.authService.register(createUserDto);
    }
    getMyProfile(req) {
        return this.authService.getProfile(req.user.id);
    }
    getTeacherRequest() {
        return this.userService.findTeacherRequest();
    }
    getPendingTeacherRequests() {
        return this.userService.findPendingTeacherRequests();
    }
    getApprovedTeachers() {
        return this.userService.findApprovedTeachers();
    }
    getAllStudents() {
        return this.userService.findAllStudentsOrderedByType();
    }
    getTeacherById(id) {
        return this.userService.findTeacherById(id);
    }
    async approveTeacherRequest(id, req) {
        const teacher = await this.userService.findOneById(id);
        if (!teacher) {
            return {
                success: false,
                message: 'Teacher not found'
            };
        }
        const result = await this.userService.update(id, { active: true });
        const youtubeTokens = this.adminAuthService.getYouTubeTokens(req.user.email);
        let emailResult = null;
        try {
            if (youtubeTokens) {
                const { google } = require('googleapis');
                const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_ADMIN_REDIRECT_URI);
                oauth2Client.setCredentials({
                    access_token: youtubeTokens.accessToken,
                    refresh_token: youtubeTokens.refreshToken
                });
                emailResult = await this.gmailService.sendTeacherApprovalEmailWithOAuth(oauth2Client, teacher.email, `${teacher.fName} ${teacher.lName}` || teacher.email);
            }
            else {
                throw new Error('Admin does not have Gmail access');
            }
        }
        catch (error) {
            console.error('Failed to send approval email:', error.message);
        }
        return {
            ...result,
            approvedBy: {
                id: req.user.id,
                email: req.user.email,
                name: `${req.user.fName} ${req.user.lName}`,
                role: req.user.role
            },
            approvedAt: new Date().toISOString(),
            emailSent: emailResult ? true : false,
            emailError: emailResult ? null : 'Failed to send approval email'
        };
    }
    async disapproveTeacherRequest(id, body, req) {
        const teacher = await this.userService.findOneById(id);
        if (!teacher) {
            return {
                success: false,
                message: 'Teacher not found'
            };
        }
        if (teacher.teacher) {
            await this.userService.deleteTeacherRecord(teacher.teacher.id);
        }
        const result = await this.userService.delete(id);
        const youtubeTokens = this.adminAuthService.getYouTubeTokens(req.user.email);
        let emailResult = null;
        try {
            if (youtubeTokens) {
                const { google } = require('googleapis');
                const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_ADMIN_REDIRECT_URI);
                oauth2Client.setCredentials({
                    access_token: youtubeTokens.accessToken,
                    refresh_token: youtubeTokens.refreshToken
                });
                emailResult = await this.gmailService.sendTeacherDisapprovalEmailWithOAuth(oauth2Client, teacher.email, `${teacher.fName} ${teacher.lName}` || teacher.email, body.reasons);
            }
            else {
                throw new Error('Admin does not have Gmail access');
            }
        }
        catch (error) {
            console.error('Failed to send disapproval email:', error.message);
        }
        return {
            ...result,
            disapprovedBy: {
                id: req.user.id,
                email: req.user.email,
                name: `${req.user.fName} ${req.user.lName}`,
                role: req.user.role
            },
            disapprovedAt: new Date().toISOString(),
            reasons: body.reasons,
            emailSent: emailResult ? true : false,
            emailError: emailResult ? null : 'Failed to send disapproval email'
        };
    }
    updateUser(req, updateUserDto) {
        return this.authService.update(req.user.id, updateUserDto);
    }
    deleteUser(req) {
        return this.authService.delete(req.user.id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "user", null);
__decorate([
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/teacherRequest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getTeacherRequest", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('/pendingTeacherRequests'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getPendingTeacherRequests", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('/approvedTeachers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getApprovedTeachers", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('/students'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllStudents", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('/teacher/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getTeacherById", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('/approveTeacher/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "approveTeacherRequest", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Delete)('/disapproveTeacher/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "disapproveTeacherRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('/'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UsersController.prototype, "deleteUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('authentication'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        gmail_service_1.GmailService,
        admin_auth_service_1.AdminAuthService])
], UsersController);
//# sourceMappingURL=users.controller.js.map