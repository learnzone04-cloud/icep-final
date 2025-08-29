import { EnrollmentService } from './enrollment.service';
export declare class EnrollmentController {
    private readonly enrollmentService;
    constructor(enrollmentService: EnrollmentService);
    startEnrollment(courseId: number, req: any): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }>;
    confirmEnrollment(courseId: number, paymentIntentId: string, paymentMethodId: string, req: any): Promise<import("./entity/EnrollCourseStudent.entity").EnrollCourseStudent>;
    enroll(courseId: number, paymentMethodId: string, couponCode: string, req: any): Promise<{
        message: string;
        enrollment?: undefined;
        coupon?: undefined;
        pricing?: undefined;
    } | {
        message: string;
        enrollment: import("./entity/EnrollCourseStudent.entity").EnrollCourseStudent;
        coupon: any;
        pricing: {
            originalPrice: number;
            finalPrice: number;
            currency: string;
        };
    }>;
    getEnrolledCourses(req: any): Promise<{
        enrollmentId: number;
        enrollDate: Date;
        mark: number;
        isPass: boolean;
        course: import("../course/entities/course.entity").Course;
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
