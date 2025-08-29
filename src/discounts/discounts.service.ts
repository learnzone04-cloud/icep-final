import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan, In } from 'typeorm';
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

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount) private readonly discountRepo: Repository<Discount>,
    @InjectRepository(Coupon) private readonly couponRepo: Repository<Coupon>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Student) private readonly studentRepo: Repository<Student>,
  ) {}

  private now(): Date {
    return new Date();
  }

  async getActiveDiscountForCourse(courseId: number): Promise<Discount | null> {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) return null;

    const now = this.now();
    
    // Find discounts that apply to this course (either specific or all courses by this teacher)
    const candidates = await this.discountRepo.find({
      where: [
        {
          teacherId: course.teacherId,
          scope: DiscountScope.COURSE,
          targetId: courseId,
          active: true,
          startAt: LessThan(now),
          endAt: MoreThan(now),
        },
        {
          teacherId: course.teacherId,
          scope: DiscountScope.ALL_COURSES,
          active: true,
          startAt: LessThan(now),
          endAt: MoreThan(now),
        },
      ],
      order: { percent: 'DESC' },
      take: 1,
    });
    return candidates[0] ?? null;
  }

  async getActiveCouponsForStudentType(studentTypeId: number): Promise<Coupon[]> {
    const now = this.now();
    
    // Find all teachers who teach this student type (look at teacher.typeId, not course.typeId)
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
    
    // Now get coupons from only those teachers
    const coupons = await this.couponRepo.find({
      where: {
        teacherId: In(teacherIds),
        mode: CouponMode.PUBLIC,
        active: true,
        startAt: LessThan(now),
        endAt: MoreThan(now),
      },
      relations: ['teacher', 'teacher.user'],
      order: { percent: 'DESC' },
    });
    
    return coupons;
  }

   async createAutomaticDiscount(body: {
    teacherId: number;
    scope: DiscountScope;
    targetId?: number;
    percent: number;
    startAt: string;
    endAt: string;
  }) {
    const { teacherId, scope, targetId, percent, startAt, endAt } = body;
    if (percent <= 0 || percent > 100) throw new BadRequestException('Invalid percent');
    if ((scope === DiscountScope.COURSE || scope === DiscountScope.ROOM) && !targetId) {
      throw new BadRequestException('targetId is required for course/room scope');
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


  async getActiveCouponsForCourse(courseId: number): Promise<Coupon[]> {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    
    if (!course) {
      return [];
    }

    const now = this.now();
    
    // Get coupons that are valid for this specific course
    const coupons = await this.couponRepo.find({
      where: [
        {
          teacherId: course.teacherId,
          mode: CouponMode.PUBLIC,
          scope: CouponScope.ALL_COURSES,
          active: true,
          startAt: LessThan(now),
          endAt: MoreThan(now),
        },
        {
          teacherId: course.teacherId,
          mode: CouponMode.PUBLIC,
          scope: CouponScope.COURSE,
          targetId: courseId,
          active: true,
          startAt: LessThan(now),
          endAt: MoreThan(now),
        },
      ],
      relations: ['teacher', 'teacher.user'],
      order: { percent: 'DESC' },
    });
    
    return coupons;
  }

  async getActiveCouponsForRoom(roomId: number): Promise<Coupon[]> {
    // For now, we'll return empty array since we don't have room entity injected
    // In the future, you can inject ConversationRoom repository and implement this properly
    return [];
  }

  async enrichCourseWithDiscount(course: Course): Promise<Course & CourseDiscountInfo> {
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

  private computeDiscountedPrice(originalPrice: number, percent: number): number {
    if (percent <= 0) return originalPrice;
    const discounted = Math.round(originalPrice - (originalPrice * percent) / 100);
    return discounted < 0 ? 0 : discounted;
  }

  // Teacher operations
  async createCoupon(body: {
    teacherId: number;
    mode: CouponMode;
    scope: CouponScope;
    targetId?: number;
    percent: number;
    startAt: string;
    endAt: string;
    limitTotal?: number;
    limitPerStudent?: number;
  }) {
    const { teacherId, mode, scope, targetId, percent, startAt, endAt, limitTotal, limitPerStudent } = body;
    if (percent <= 0 || percent > 100) throw new BadRequestException('Invalid percent');
    
    // Validate dates
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);
    
    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('Invalid startAt date');
    }
    if (isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid endAt date');
    }
    if (startDate >= endDate) {
      throw new BadRequestException('startAt must be before endAt');
    }
    
    // generate a unique code for all modes
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

  private generateCode(): string {
    // 4-4-4 format, uppercase
    const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${part()}-${part()}-${part()}`;
  }
}


