import { Controller, Post, Body, Req, UseGuards, BadRequestException, Get, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post('start')
  @UseGuards(JwtAuthGuard)
  async startEnrollment(@Body('courseId') courseId: number, @Req() req) {
    const userId = req.user.id;
    return this.enrollmentService.startEnrollment(userId, courseId);
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  async confirmEnrollment(
    @Body('courseId') courseId: number,
    @Body('paymentIntentId') paymentIntentId: string,
    @Body('paymentMethodId') paymentMethodId: string,
    @Req() req
  ) {
    const userId = req.user.id;
    return this.enrollmentService.confirmEnrollment(userId, courseId, paymentIntentId, paymentMethodId);
  }

  @Post('enroll')
  @UseGuards(JwtAuthGuard)
  async enroll(
    @Body('courseId') courseId: number,
    @Body('paymentMethodId') paymentMethodId: string,
    @Body('couponCode') couponCode: string,
    @Req() req
  ) {
    const userId = req.user.id;
    return this.enrollmentService.enrollAndPay(userId, courseId, paymentMethodId, couponCode);
  }

  @Get('enrolled-courses')
  @UseGuards(JwtAuthGuard)
  async getEnrolledCourses(@Req() req) {
    const userId = req.user.id;
    return this.enrollmentService.getEnrolledCourses(userId);
  }

  @Get('course/:courseId/students')
  @UseGuards(JwtAuthGuard)
  async getStudentsEnrolledInCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentService.getStudentsEnrolledInCourse(courseId);
  }
} 