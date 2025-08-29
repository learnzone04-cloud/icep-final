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
exports.DiscountsController = void 0;
const common_1 = require("@nestjs/common");
const discounts_service_1 = require("./discounts.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let DiscountsController = class DiscountsController {
    constructor(discountsService) {
        this.discountsService = discountsService;
    }
    async getStudentCoupons(req) {
        if (req.user?.role !== 'Student' || !req.user?.typeId) {
            throw new common_1.ForbiddenException('Student access required');
        }
        return this.discountsService.getActiveCouponsForStudentType(req.user.typeId);
    }
    async getCourseCoupons(courseId) {
        return this.discountsService.getActiveCouponsForCourse(Number(courseId));
    }
    async createAutomaticDiscount(req, body) {
        if (req.user?.role !== 'Teacher' || !req.user?.teacherId)
            throw new common_1.ForbiddenException('Teacher access required');
        return this.discountsService.createAutomaticDiscount({ ...body, teacherId: req.user.teacherId });
    }
    async createCoupon(req, body) {
        if (req.user?.role !== 'Teacher' || !req.user?.teacherId)
            throw new common_1.ForbiddenException('Teacher access required');
        return this.discountsService.createCoupon({ ...body, teacherId: req.user.teacherId });
    }
};
exports.DiscountsController = DiscountsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('student/coupons'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiscountsController.prototype, "getStudentCoupons", null);
__decorate([
    (0, common_1.Get)('course/:courseId/coupons'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiscountsController.prototype, "getCourseCoupons", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('teacher/discounts'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DiscountsController.prototype, "createAutomaticDiscount", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('teacher/coupons'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DiscountsController.prototype, "createCoupon", null);
exports.DiscountsController = DiscountsController = __decorate([
    (0, common_1.Controller)('discounts'),
    __metadata("design:paramtypes", [discounts_service_1.DiscountsService])
], DiscountsController);
//# sourceMappingURL=discounts.controller.js.map