import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../course/entities/course.entity';
import { EnrollCourseStudent } from './entity/EnrollCourseStudent.entity';
import { Student } from '../student/entity/Student';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PlacementLevel } from '../placement-test/placement-test.entity';
import { StudentType } from '../student-type/entity/StudentType';
import { Exam } from '../exam/entities/exam.entity';
import { ExamStudent } from '../exam-student/exam-student.entity';
import { CourseVideoProgressService } from '../course-video-progress/course-video-progress.service';
import { DiscountsService } from 'src/discounts/discounts.service';

@Injectable()
export class EnrollmentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(EnrollCourseStudent)
    private readonly enrollRepo: Repository<EnrollCourseStudent>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    private readonly courseVideoProgressService: CourseVideoProgressService,
    private readonly discountsService: DiscountsService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), { apiVersion: '2025-05-28.basil' });
  }

  async startEnrollment(userId: number, courseId: number) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.currency !== 'usd') throw new BadRequestException('Course currency must be USD');
    const amount = Math.round(course.price * 100); // Stripe expects cents
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { userId: String(userId), courseId: String(courseId) },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async confirmEnrollment(userId: number, courseId: number, paymentIntentId: string, paymentMethodId: string) {
    // Confirm the payment intent with the payment method (test only)
    const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment not completed');
    }
    // Find the student by userId
    const student = await this.studentRepo.findOne({ where: { userId } });
    if (!student) {
      throw new BadRequestException('Student not found');
    }
    // 2. Check if already enrolled
    const existing = await this.enrollRepo.findOne({ where: { studentId: student.id, courseId } });
    if (existing) {
      throw new BadRequestException('Already enrolled');
    }
    // 3. Create enrollment
    const enrollment = this.enrollRepo.create({ studentId: student.id, courseId });
    return this.enrollRepo.save(enrollment);
  }

  async enrollAndPay(userId: number, courseId: number, paymentMethodId: string, couponCode?: string) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    if (course.currency !== 'usd') throw new BadRequestException('Course currency must be USD');

    // Fetch student
    const student = await this.studentRepo.findOne({ where: { userId } });
    if (!student) throw new BadRequestException('Student not found');

    // Fetch student's level for this course's type
    const studentType = await this.studentRepo.manager.findOne(StudentType, { where: { studentId: student.id, typeId: course.typeId } });
    if (!studentType || !studentType.level) {
      throw new BadRequestException('Student does not have a placement level for this course type');
    }
    // Compare levels using PlacementLevel enum order
    const levels = Object.values(PlacementLevel);
    const studentLevelIdx = levels.indexOf(studentType.level as PlacementLevel);
    const courseLevelIdx = levels.indexOf(course.level);
    if (studentLevelIdx === -1 || courseLevelIdx === -1) {
      throw new BadRequestException('Invalid level data');
    }
    if (studentLevelIdx < courseLevelIdx) {
      return { message: 'Your level is too low to enroll in this course.' };
    }

    // Pricing: handle coupon if provided
    let finalPrice = course.price;
    let appliedCoupon = null;
    
    if (couponCode) {
      // Find and validate the coupon
      const coupons = await this.discountsService.getActiveCouponsForCourse(courseId);
      const coupon = coupons.find(c => c.code === couponCode.toUpperCase());
      
      if (!coupon) {
        throw new BadRequestException('Invalid coupon code');
      }
      
      // Validate coupon dates
      const now = new Date();
      if (coupon.startAt > now || coupon.endAt < now) {
        throw new BadRequestException('Coupon is not active');
      }
      
      // Validate coupon scope and teacher
      if (coupon.scope === 'course' && coupon.targetId !== courseId) {
        throw new BadRequestException('Coupon not valid for this course');
      }
      
      if (coupon.scope === 'all_courses' && coupon.teacherId !== course.teacherId) {
        throw new BadRequestException('Coupon not valid for this course');
      }
      
      // Apply discount
      const discountAmount = (course.price * coupon.percent) / 100;
      finalPrice = Math.max(0, course.price - discountAmount);
      appliedCoupon = {
        code: coupon.code,
        percent: coupon.percent,
        originalPrice: course.price,
        discountedPrice: finalPrice,
        discountAmount: discountAmount
      };
    }

    const amount = Math.round(finalPrice * 100);

    // Create and confirm the PaymentIntent in one step
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: { 
        userId: String(userId), 
        courseId: String(courseId),
        couponCode: couponCode || '',
        originalPrice: String(course.price),
        finalPrice: String(finalPrice)
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (paymentIntent.status !== 'succeeded') {
      return { message: "Payment was not successful. Please try again or use a different payment method." };
    }

    // Check if already enrolled
    const existing = await this.enrollRepo.findOne({ where: { studentId: student.id, courseId } });
    if (existing) throw new BadRequestException('Already enrolled');

    // Create enrollment
    const enrollment = this.enrollRepo.create({ studentId: student.id, courseId });
    await this.enrollRepo.save(enrollment);

    // Create ExamStudent rows for only 'A' mid and 'A' final exams in the course
    const exams = await this.courseRepo.manager.find(Exam, { where: { course: { id: courseId } } });
    if (exams && exams.length > 0) {
      const filteredExams = exams.filter(exam =>
        (exam.type === 'Mid Exam' && exam.label === 'A') ||
        (exam.type === 'Final Exam' && exam.label === 'A')
      );
      const examStudents = filteredExams.map(exam => {
        return this.enrollRepo.manager.create(ExamStudent, {
          examId: exam.id,
          studentId: student.id,
          courseId: exam.courseId,
          examType: exam.type,
          mark: null,
        });
      });
      if (examStudents.length > 0) {
        await this.enrollRepo.manager.save(ExamStudent, examStudents);
      }
    }

    // Initialize video progress for this student and course
    await this.courseVideoProgressService.initializeProgress(userId, courseId);

    return { 
      message: "Enrollment successful!", 
      enrollment,
      coupon: appliedCoupon,
      pricing: {
        originalPrice: course.price,
        finalPrice: finalPrice,
        currency: course.currency
      }
    };
  }

  async getEnrolledCourses(userId: number) {
    const student = await this.studentRepo.findOne({ where: { userId } });
    if (!student) {
      throw new BadRequestException('Student not found');
    }

    const enrollments = await this.enrollRepo.find({
      where: { studentId: student.id },
      relations: ['course', 'course.teacher', 'course.type'],
    });

    return enrollments.map(enrollment => ({
      enrollmentId: enrollment.id,
      enrollDate: enrollment.enrollDate,
      mark: enrollment.mark,
      isPass: enrollment.isPass,
      course: enrollment.course,
    }));
  }

  async getStudentsEnrolledInCourse(courseId: number) {
    const enrollments = await this.enrollRepo.find({
      where: { courseId },
      relations: ['student', 'student.user'],
      order: { enrollDate: 'DESC' },
    });

    return enrollments.map(enrollment => ({
      enrollmentId: enrollment.id,
      enrollDate: enrollment.enrollDate,
      mark: enrollment.mark,
      isPass: enrollment.isPass,
      student: {
        id: enrollment.student.id,
        userId: enrollment.student.userId,
        work: enrollment.student.work,
        user: enrollment.student.user,
      },
    }));
  }
} 