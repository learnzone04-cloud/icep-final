import { TeacherService } from './teacher.service';
import { UpdateTeacherProfileDto } from './dtos/update-teacher-profile.dto';
export declare class TeacherController {
    private readonly teacherService;
    constructor(teacherService: TeacherService);
    findAll(req: any): Promise<import("./entity/Teacher").TeacherEntity[]>;
    findOne(req: any, id: number): Promise<{
        averageRating: number;
        id: number;
        facebookUrl: string;
        instagramUrl: string;
        certificate: import("../certificate/entities/certificate.entity").CertificateEntity;
        coverLetter: string;
        cv: string;
        userId: number;
        typeId: number;
        user: import("../users/entity/User").UserEntity;
        type: import("../types/entity/Type").TypeEntity;
        followers: import("../follower/entities/follower.entity").Follower[];
        course: import("../course/entities/course.entity").Course[];
        conversationRooms: import("../conversation-room/entity/ConversationRoom").ConversationRoom[];
        stories: import("../story/entity/Story").Story[];
        rates: import("../rate/entities/rate.entity").Rate[];
        discounts: import("../discounts/entities/discount.entity").Discount[];
        coupons: import("../discounts/entities/coupon.entity").Coupon[];
        createdAt: Date;
    }>;
    completeProfile(req: any, files: {
        certificates?: Express.Multer.File[];
        cv?: Express.Multer.File[];
    }, id: number): Promise<any>;
    updateTeacherProfile(req: any, updateTeacherProfileDto: UpdateTeacherProfileDto): Promise<import("./entity/Teacher").TeacherEntity>;
    updateTeacherCV(req: any, files: {
        cv?: Express.Multer.File[];
    }): Promise<import("./entity/Teacher").TeacherEntity>;
    getTeacherArticles(req: any): Promise<import("../article/entity/Article").ArticleEntity[]>;
    getTeacherReels(req: any): Promise<import("../reels/entity/Reel").ReelEntity[]>;
    getTeacherCourses(req: any): Promise<import("../course/entities/course.entity").Course[]>;
}
