import { Repository } from 'typeorm';
import { Discount, DiscountScope } from './entities/discount.entity';
import { Coupon, CouponMode, CouponScope } from './entities/coupon.entity';
import { Course } from 'src/course/entities/course.entity';
import { Student } from 'src/student/entity/Student';
export interface CourseDiscountInfo {
    hasDiscount: boolean;
    discountPercent: number;
    originalPrice: number;
    discountedPrice: number;
    discountAmount: number;
    discountStartAt?: Date;
    discountEndAt?: Date;
}
export declare class DiscountsService {
    private readonly discountRepo;
    private readonly couponRepo;
    private readonly courseRepo;
    private readonly studentRepo;
    constructor(discountRepo: Repository<Discount>, couponRepo: Repository<Coupon>, courseRepo: Repository<Course>, studentRepo: Repository<Student>);
    private now;
    getActiveDiscountForCourse(courseId: number): Promise<Discount | null>;
    getActiveCouponsForStudentType(studentTypeId: number): Promise<Coupon[]>;
    createAutomaticDiscount(body: {
        teacherId: number;
        scope: DiscountScope;
        targetId?: number;
        percent: number;
        startAt: string;
        endAt: string;
    }): Promise<Discount>;
    getActiveCouponsForCourse(courseId: number): Promise<Coupon[]>;
    getActiveCouponsForRoom(roomId: number): Promise<Coupon[]>;
    enrichCourseWithDiscount(course: Course): Promise<Course & CourseDiscountInfo>;
    private computeDiscountedPrice;
    createCoupon(body: {
        teacherId: number;
        mode: CouponMode;
        scope: CouponScope;
        targetId?: number;
        percent: number;
        startAt: string;
        endAt: string;
        limitTotal?: number;
        limitPerStudent?: number;
    }): Promise<Coupon>;
    private generateCode;
}
