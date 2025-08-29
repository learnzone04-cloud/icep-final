import { Repository } from 'typeorm';
import { Course } from '../course/entities/course.entity';
import { EnrollCourseStudent } from './entity/EnrollCourseStudent.entity';
import { Student } from '../student/entity/Student';
import { ConfigService } from '@nestjs/config';
import { CourseVideoProgressService } from '../course-video-progress/course-video-progress.service';
import { DiscountsService } from 'src/discounts/discounts.service';
export declare class EnrollmentService {
    private readonly courseRepo;
    private readonly enrollRepo;
    private readonly studentRepo;
    private readonly courseVideoProgressService;
    private readonly discountsService;
    private readonly configService;
    private stripe;
    constructor(courseRepo: Repository<Course>, enrollRepo: Repository<EnrollCourseStudent>, studentRepo: Repository<Student>, courseVideoProgressService: CourseVideoProgressService, discountsService: DiscountsService, configService: ConfigService);
    startEnrollment(userId: number, courseId: number): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }>;
    confirmEnrollment(userId: number, courseId: number, paymentIntentId: string, paymentMethodId: string): Promise<EnrollCourseStudent>;
    enrollAndPay(userId: number, courseId: number, paymentMethodId: string, couponCode?: string): Promise<{
        message: string;
        enrollment?: undefined;
        coupon?: undefined;
        pricing?: undefined;
    } | {
        message: string;
        enrollment: EnrollCourseStudent;
        coupon: any;
        pricing: {
            originalPrice: number;
            finalPrice: number;
            currency: string;
        };
    }>;
    getEnrolledCourses(userId: number): Promise<{
        enrollmentId: number;
        enrollDate: Date;
        mark: number;
        isPass: boolean;
        course: Course;
    }[]>;
    getStudentsEnrolledInCourse(courseId: number): Promise<{
        enrollmentId: number;
        enrollDate: Date;
        mark: number;
        isPass: boolean;
        student: {
            id: number;
            userId: number;
            work: string;
            user: import("../users/entity/User").UserEntity;
        };
    }[]>;
}
