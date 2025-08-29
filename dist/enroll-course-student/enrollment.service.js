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
exports.EnrollmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const course_entity_1 = require("../course/entities/course.entity");
const EnrollCourseStudent_entity_1 = require("./entity/EnrollCourseStudent.entity");
const Student_1 = require("../student/entity/Student");
const stripe_1 = require("stripe");
const config_1 = require("@nestjs/config");
const placement_test_entity_1 = require("../placement-test/placement-test.entity");
const StudentType_1 = require("../student-type/entity/StudentType");
const exam_entity_1 = require("../exam/entities/exam.entity");
const exam_student_entity_1 = require("../exam-student/exam-student.entity");
const course_video_progress_service_1 = require("../course-video-progress/course-video-progress.service");
const discounts_service_1 = require("../discounts/discounts.service");
let EnrollmentService = class EnrollmentService {
    constructor(courseRepo, enrollRepo, studentRepo, courseVideoProgressService, discountsService, configService) {
        this.courseRepo = courseRepo;
        this.enrollRepo = enrollRepo;
        this.studentRepo = studentRepo;
        this.courseVideoProgressService = courseVideoProgressService;
        this.discountsService = discountsService;
        this.configService = configService;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), { apiVersion: '2025-05-28.basil' });
    }
    async startEnrollment(userId, courseId) {
        const course = await this.courseRepo.findOne({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (course.currency !== 'usd')
            throw new common_1.BadRequestException('Course currency must be USD');
        const amount = Math.round(course.price * 100);
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
    async confirmEnrollment(userId, courseId, paymentIntentId, paymentMethodId) {
        const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentMethodId,
        });
        if (paymentIntent.status !== 'succeeded') {
            throw new common_1.BadRequestException('Payment not completed');
        }
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student) {
            throw new common_1.BadRequestException('Student not found');
        }
        const existing = await this.enrollRepo.findOne({ where: { studentId: student.id, courseId } });
        if (existing) {
            throw new common_1.BadRequestException('Already enrolled');
        }
        const enrollment = this.enrollRepo.create({ studentId: student.id, courseId });
        return this.enrollRepo.save(enrollment);
    }
    async enrollAndPay(userId, courseId, paymentMethodId, couponCode) {
        const course = await this.courseRepo.findOne({ where: { id: courseId } });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        if (course.currency !== 'usd')
            throw new common_1.BadRequestException('Course currency must be USD');
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student)
            throw new common_1.BadRequestException('Student not found');
        const studentType = await this.studentRepo.manager.findOne(StudentType_1.StudentType, { where: { studentId: student.id, typeId: course.typeId } });
        if (!studentType || !studentType.level) {
            throw new common_1.BadRequestException('Student does not have a placement level for this course type');
        }
        const levels = Object.values(placement_test_entity_1.PlacementLevel);
        const studentLevelIdx = levels.indexOf(studentType.level);
        const courseLevelIdx = levels.indexOf(course.level);
        if (studentLevelIdx === -1 || courseLevelIdx === -1) {
            throw new common_1.BadRequestException('Invalid level data');
        }
        if (studentLevelIdx < courseLevelIdx) {
            return { message: 'Your level is too low to enroll in this course.' };
        }
        let finalPrice = course.price;
        let appliedCoupon = null;
        if (couponCode) {
            const coupons = await this.discountsService.getActiveCouponsForCourse(courseId);
            const coupon = coupons.find(c => c.code === couponCode.toUpperCase());
            if (!coupon) {
                throw new common_1.BadRequestException('Invalid coupon code');
            }
            const now = new Date();
            if (coupon.startAt > now || coupon.endAt < now) {
                throw new common_1.BadRequestException('Coupon is not active');
            }
            if (coupon.scope === 'course' && coupon.targetId !== courseId) {
                throw new common_1.BadRequestException('Coupon not valid for this course');
            }
            if (coupon.scope === 'all_courses' && coupon.teacherId !== course.teacherId) {
                throw new common_1.BadRequestException('Coupon not valid for this course');
            }
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
        const existing = await this.enrollRepo.findOne({ where: { studentId: student.id, courseId } });
        if (existing)
            throw new common_1.BadRequestException('Already enrolled');
        const enrollment = this.enrollRepo.create({ studentId: student.id, courseId });
        await this.enrollRepo.save(enrollment);
        const exams = await this.courseRepo.manager.find(exam_entity_1.Exam, { where: { course: { id: courseId } } });
        if (exams && exams.length > 0) {
            const filteredExams = exams.filter(exam => (exam.type === 'Mid Exam' && exam.label === 'A') ||
                (exam.type === 'Final Exam' && exam.label === 'A'));
            const examStudents = filteredExams.map(exam => {
                return this.enrollRepo.manager.create(exam_student_entity_1.ExamStudent, {
                    examId: exam.id,
                    studentId: student.id,
                    courseId: exam.courseId,
                    examType: exam.type,
                    mark: null,
                });
            });
            if (examStudents.length > 0) {
                await this.enrollRepo.manager.save(exam_student_entity_1.ExamStudent, examStudents);
            }
        }
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
    async getEnrolledCourses(userId) {
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student) {
            throw new common_1.BadRequestException('Student not found');
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
    async getStudentsEnrolledInCourse(courseId) {
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
};
exports.EnrollmentService = EnrollmentService;
exports.EnrollmentService = EnrollmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(1, (0, typeorm_1.InjectRepository)(EnrollCourseStudent_entity_1.EnrollCourseStudent)),
    __param(2, (0, typeorm_1.InjectRepository)(Student_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        course_video_progress_service_1.CourseVideoProgressService,
        discounts_service_1.DiscountsService,
        config_1.ConfigService])
], EnrollmentService);
//# sourceMappingURL=enrollment.service.js.map