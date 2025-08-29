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
exports.EnrollmentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const enrollment_service_1 = require("./enrollment.service");
let EnrollmentController = class EnrollmentController {
    constructor(enrollmentService) {
        this.enrollmentService = enrollmentService;
    }
    async startEnrollment(courseId, req) {
        const userId = req.user.id;
        return this.enrollmentService.startEnrollment(userId, courseId);
    }
    async confirmEnrollment(courseId, paymentIntentId, paymentMethodId, req) {
        const userId = req.user.id;
        return this.enrollmentService.confirmEnrollment(userId, courseId, paymentIntentId, paymentMethodId);
    }
    async enroll(courseId, paymentMethodId, couponCode, req) {
        const userId = req.user.id;
        return this.enrollmentService.enrollAndPay(userId, courseId, paymentMethodId, couponCode);
    }
    async getEnrolledCourses(req) {
        const userId = req.user.id;
        return this.enrollmentService.getEnrolledCourses(userId);
    }
    async getStudentsEnrolledInCourse(courseId) {
        return this.enrollmentService.getStudentsEnrolledInCourse(courseId);
    }
};
exports.EnrollmentController = EnrollmentController;
__decorate([
    (0, common_1.Post)('start'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('courseId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "startEnrollment", null);
__decorate([
    (0, common_1.Post)('confirm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('courseId')),
    __param(1, (0, common_1.Body)('paymentIntentId')),
    __param(2, (0, common_1.Body)('paymentMethodId')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "confirmEnrollment", null);
__decorate([
    (0, common_1.Post)('enroll'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('courseId')),
    __param(1, (0, common_1.Body)('paymentMethodId')),
    __param(2, (0, common_1.Body)('couponCode')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "enroll", null);
__decorate([
    (0, common_1.Get)('enrolled-courses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "getEnrolledCourses", null);
__decorate([
    (0, common_1.Get)('course/:courseId/students'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "getStudentsEnrolledInCourse", null);
exports.EnrollmentController = EnrollmentController = __decorate([
    (0, common_1.Controller)('enrollment'),
    __metadata("design:paramtypes", [enrollment_service_1.EnrollmentService])
], EnrollmentController);
//# sourceMappingURL=enrollment.controller.js.map