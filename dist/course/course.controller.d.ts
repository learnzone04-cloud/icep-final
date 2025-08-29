import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CourseVideoEntity } from '../course-video/entity/course-video.entity';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { UserEntity } from '../users/entity/User';
export declare class CourseController {
    private readonly courseService;
    private courseRepo;
    private videoRepo;
    private teacherRepo;
    private userRepo;
    constructor(courseService: CourseService, courseRepo: Repository<Course>, videoRepo: Repository<CourseVideoEntity>, teacherRepo: Repository<TeacherEntity>, userRepo: Repository<UserEntity>);
    create(createCourseDto: CreateCourseDto, req: any): Promise<Course>;
    findAll(req: any): Promise<(Course & import("../discounts/discounts.service").CourseDiscountInfo)[]>;
    getUnapprovedVideosGroupedByCourse(): Promise<unknown[]>;
    findOne(id: number): Promise<Course & import("../discounts/discounts.service").CourseDiscountInfo>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course & import("../discounts/discounts.service").CourseDiscountInfo>;
    remove(id: string): Promise<Course>;
}
