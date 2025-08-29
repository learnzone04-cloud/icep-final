import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { TeacherService } from 'src/teacher/teacher.service';
import { TypesService } from 'src/types/types.service';
import { NotificationService } from 'src/notification/notification.service';
import { DiscountsService } from 'src/discounts/discounts.service';
export declare class CourseService {
    private repo;
    private teacherService;
    private typeService;
    private notificationService;
    private discountsService;
    constructor(repo: Repository<Course>, teacherService: TeacherService, typeService: TypesService, notificationService: NotificationService, discountsService: DiscountsService);
    create(userId: number, data: CreateCourseDto): Promise<Course>;
    find(): Promise<(Course & import("src/discounts/discounts.service").CourseDiscountInfo)[]>;
    findByUserType(user: any): Promise<(Course & import("src/discounts/discounts.service").CourseDiscountInfo)[]>;
    findOne(id: number): Promise<Course & import("src/discounts/discounts.service").CourseDiscountInfo>;
    delete(id: number): Promise<Course>;
    update(id: number, data: UpdateCourseDto): Promise<Course & import("src/discounts/discounts.service").CourseDiscountInfo>;
}
