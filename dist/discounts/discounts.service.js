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
exports.DiscountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const discount_entity_1 = require("./entities/discount.entity");
const coupon_entity_1 = require("./entities/coupon.entity");
const course_entity_1 = require("../course/entities/course.entity");
const Student_1 = require("../student/entity/Student");
let DiscountsService = class DiscountsService {
    constructor(discountRepo, couponRepo, courseRepo, studentRepo) {
        this.discountRepo = discountRepo;
        this.couponRepo = couponRepo;
        this.courseRepo = courseRepo;
        this.studentRepo = studentRepo;
    }
    now() {
        return new Date();
    }
    async getActiveDiscountForCourse(courseId) {
        const course = await this.courseRepo.findOne({ where: { id: courseId } });
        if (!course)
            return null;
        const now = this.now();
        const candidates = await this.discountRepo.find({
            where: [
                {
                    teacherId: course.teacherId,
                    scope: discount_entity_1.DiscountScope.COURSE,
                    targetId: courseId,
                    active: true,
                    startAt: (0, typeorm_2.LessThan)(now),
                    endAt: (0, typeorm_2.MoreThan)(now),
                },
                {
                    teacherId: course.teacherId,
                    scope: discount_entity_1.DiscountScope.ALL_COURSES,
                    active: true,
                    startAt: (0, typeorm_2.LessThan)(now),
                    endAt: (0, typeorm_2.MoreThan)(now),
                },
            ],
            order: { percent: 'DESC' },
            take: 1,
        });
        return candidates[0] ?? null;
    }
    async getActiveCouponsForStudentType(studentTypeId) {
        const now = this.now();
        const teachersWithType = await this.courseRepo.manager
            .createQueryBuilder()
            .select('teacher.id', 'teacherId')
            .from('teachers', 'teacher')
            .where('teacher.typeId = :studentTypeId', { studentTypeId })
            .getRawMany();
        if (teachersWithType.length === 0) {
            return [];
        }
        const teacherIds = teachersWithType.map(t => t.teacherId);
        const coupons = await this.couponRepo.find({
            where: {
                teacherId: (0, typeorm_2.In)(teacherIds),
                mode: coupon_entity_1.CouponMode.PUBLIC,
                active: true,
                startAt: (0, typeorm_2.LessThan)(now),
                endAt: (0, typeorm_2.MoreThan)(now),
            },
            relations: ['teacher', 'teacher.user'],
            order: { percent: 'DESC' },
        });
        return coupons;
    }
    async createAutomaticDiscount(body) {
        const { teacherId, scope, targetId, percent, startAt, endAt } = body;
        if (percent <= 0 || percent > 100)
            throw new common_1.BadRequestException('Invalid percent');
        if ((scope === discount_entity_1.DiscountScope.COURSE || scope === discount_entity_1.DiscountScope.ROOM) && !targetId) {
            throw new common_1.BadRequestException('targetId is required for course/room scope');
        }
        const entity = this.discountRepo.create({
            teacherId,
            scope,
            targetId,
            percent,
            startAt: new Date(startAt),
            endAt: new Date(endAt),
            active: true,
        });
        return this.discountRepo.save(entity);
    }
    async getActiveCouponsForCourse(courseId) {
        const course = await this.courseRepo.findOne({ where: { id: courseId } });
        if (!course) {
            return [];
        }
        const now = this.now();
        const coupons = await this.couponRepo.find({
            where: [
                {
                    teacherId: course.teacherId,
                    mode: coupon_entity_1.CouponMode.PUBLIC,
                    scope: coupon_entity_1.CouponScope.ALL_COURSES,
                    active: true,
                    startAt: (0, typeorm_2.LessThan)(now),
                    endAt: (0, typeorm_2.MoreThan)(now),
                },
                {
                    teacherId: course.teacherId,
                    mode: coupon_entity_1.CouponMode.PUBLIC,
                    scope: coupon_entity_1.CouponScope.COURSE,
                    targetId: courseId,
                    active: true,
                    startAt: (0, typeorm_2.LessThan)(now),
                    endAt: (0, typeorm_2.MoreThan)(now),
                },
            ],
            relations: ['teacher', 'teacher.user'],
            order: { percent: 'DESC' },
        });
        return coupons;
    }
    async getActiveCouponsForRoom(roomId) {
        return [];
    }
    async enrichCourseWithDiscount(course) {
        const discount = await this.getActiveDiscountForCourse(course.id);
        if (!discount) {
            return {
                ...course,
                hasDiscount: false,
                discountPercent: 0,
                originalPrice: course.price,
                discountedPrice: course.price,
                discountAmount: 0,
            };
        }
        const discountedPrice = this.computeDiscountedPrice(course.price, discount.percent);
        return {
            ...course,
            hasDiscount: true,
            discountPercent: discount.percent,
            originalPrice: course.price,
            discountedPrice,
            discountAmount: course.price - discountedPrice,
            discountStartAt: discount.startAt,
            discountEndAt: discount.endAt,
        };
    }
    computeDiscountedPrice(originalPrice, percent) {
        if (percent <= 0)
            return originalPrice;
        const discounted = Math.round(originalPrice - (originalPrice * percent) / 100);
        return discounted < 0 ? 0 : discounted;
    }
    async createCoupon(body) {
        const { teacherId, mode, scope, targetId, percent, startAt, endAt, limitTotal, limitPerStudent } = body;
        if (percent <= 0 || percent > 100)
            throw new common_1.BadRequestException('Invalid percent');
        const startDate = new Date(startAt);
        const endDate = new Date(endAt);
        if (isNaN(startDate.getTime())) {
            throw new common_1.BadRequestException('Invalid startAt date');
        }
        if (isNaN(endDate.getTime())) {
            throw new common_1.BadRequestException('Invalid endAt date');
        }
        if (startDate >= endDate) {
            throw new common_1.BadRequestException('startAt must be before endAt');
        }
        const generatedCode = this.generateCode();
        const entity = this.couponRepo.create({
            teacherId,
            mode,
            scope,
            targetId,
            percent,
            startAt: startDate,
            endAt: endDate,
            code: generatedCode,
            limitTotal: limitTotal ?? 0,
            limitPerStudent: limitPerStudent ?? 1,
            active: true,
        });
        return this.couponRepo.save(entity);
    }
    generateCode() {
        const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
        return `${part()}-${part()}-${part()}`;
    }
};
exports.DiscountsService = DiscountsService;
exports.DiscountsService = DiscountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(discount_entity_1.Discount)),
    __param(1, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __param(2, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(3, (0, typeorm_1.InjectRepository)(Student_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DiscountsService);
//# sourceMappingURL=discounts.service.js.map