import { Body, Controller, Param, Post, Req, UseGuards, ForbiddenException, Get } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CouponMode, CouponScope } from './entities/coupon.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CouponResponseDto } from './dtos/coupon-response.dto';
import { DiscountScope } from './entities/discount.entity';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('student/coupons')
  async getStudentCoupons(@Req() req: any): Promise<CouponResponseDto[]> {
    if (req.user?.role !== 'Student' || !req.user?.typeId) {
      throw new ForbiddenException('Student access required');
    }
    return this.discountsService.getActiveCouponsForStudentType(req.user.typeId);
  }

  @Get('course/:courseId/coupons')
  async getCourseCoupons(@Param('courseId') courseId: string): Promise<CouponResponseDto[]> {
    return this.discountsService.getActiveCouponsForCourse(Number(courseId));
  }

   @UseGuards(JwtAuthGuard)
  @Post('teacher/discounts')
  async createAutomaticDiscount(
    @Req() req: any,
    @Body()
    body: {
      scope: DiscountScope; // all_courses | all_rooms | course | room
      targetId?: number; // required for course/room
      percent: number;
      startAt: string;
      endAt: string;
    },
  ) {
    if (req.user?.role !== 'Teacher' || !req.user?.teacherId) throw new ForbiddenException('Teacher access required');
    return this.discountsService.createAutomaticDiscount({ ...body, teacherId: req.user.teacherId });
  }

  // Teacher endpoints (minimal)
  @UseGuards(JwtAuthGuard)
  @Post('teacher/coupons')
  async createCoupon(
    @Req() req: any,
    @Body()
    body: {
      mode: CouponMode;
      scope: CouponScope;
      targetId?: number;
      percent: number;
      startAt: string;
      endAt: string;
      limitTotal?: number;
      limitPerStudent?: number;
    },
  ) {
    if (req.user?.role !== 'Teacher' || !req.user?.teacherId) throw new ForbiddenException('Teacher access required');
    return this.discountsService.createCoupon({ ...body, teacherId: req.user.teacherId });
  }
}


