import { DiscountsService } from './discounts.service';
import { CouponMode, CouponScope } from './entities/coupon.entity';
import { CouponResponseDto } from './dtos/coupon-response.dto';
import { DiscountScope } from './entities/discount.entity';
export declare class DiscountsController {
    private readonly discountsService;
    constructor(discountsService: DiscountsService);
    getStudentCoupons(req: any): Promise<CouponResponseDto[]>;
    getCourseCoupons(courseId: string): Promise<CouponResponseDto[]>;
    createAutomaticDiscount(req: any, body: {
        scope: DiscountScope;
        targetId?: number;
        percent: number;
        startAt: string;
        endAt: string;
    }): Promise<import("./entities/discount.entity").Discount>;
    createCoupon(req: any, body: {
        mode: CouponMode;
        scope: CouponScope;
        targetId?: number;
        percent: number;
        startAt: string;
        endAt: string;
        limitTotal?: number;
        limitPerStudent?: number;
    }): Promise<import("./entities/coupon.entity").Coupon>;
}
