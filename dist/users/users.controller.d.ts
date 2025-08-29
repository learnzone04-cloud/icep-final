import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { GmailService } from 'src/gmail/gmail.service';
import { AdminAuthService } from 'src/admin-auth/admin-auth.service';
export declare class UsersController {
    private readonly authService;
    private readonly userService;
    private readonly gmailService;
    private readonly adminAuthService;
    constructor(authService: AuthService, userService: UsersService, gmailService: GmailService, adminAuthService: AdminAuthService);
    user(req: any): {
        msg: string;
    };
    login(req: any): any;
    register(req: any, createUserDto: CreateUserDto): any;
    getMyProfile(req: any): Promise<import("./entity/User").UserEntity>;
    getTeacherRequest(): Promise<import("./entity/User").UserEntity[]>;
    getPendingTeacherRequests(): Promise<{
        id: number;
        name: string;
        email: string;
        teacherCreatedAt: Date;
        phoneNumber: string;
    }[]>;
    getApprovedTeachers(): Promise<{
        id: number;
        name: string;
        email: string;
        teacherCreatedAt: Date;
        phoneNumber: string;
    }[]>;
    getAllStudents(): Promise<{
        studentsByType: {
            [key: string]: any[];
        };
        multipleTypeStudents: {
            id: number;
            name: string;
            email: string;
            phoneNumber: string;
            studentCreatedAt: Date;
            types: {
                typeId: number;
                typeName: string;
            }[];
        }[];
    }>;
    getTeacherById(id: number): Promise<{
        id: number;
        fName: string;
        lName: string;
        phoneNumber: string;
        active: boolean;
        email: string;
        password: string;
        role: import("./entity/User").UserRole;
        createdAt: Date;
        teacher: {
            id: number;
            facebookUrl: string;
            instagramUrl: string;
            coverLetter: string;
            cv: string;
            userId: number;
            typeId: number;
            createdAt: Date;
            certificate: any[] | import("../certificate/entities/certificate.entity").CertificateEntity;
        };
    }>;
    approveTeacherRequest(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    } | {
        approvedBy: {
            id: any;
            email: any;
            name: string;
            role: any;
        };
        approvedAt: string;
        emailSent: boolean;
        emailError: string;
        id: number;
        fName: string;
        lName: string;
        phoneNumber: string;
        active: boolean;
        email: string;
        password: string;
        role: import("./entity/User").UserRole;
        teacher: import("../teacher/entity/Teacher").TeacherEntity;
        student: import("../student/entity/Student").Student;
        reels: import("../reels/entity/Reel").ReelEntity[];
        shortVideos: import("../short-video/entity/ShortVideo").ShortVideoEntity[];
        articles: import("../article/entity/Article").ArticleEntity[];
        reelLikes: import("../reel-like/entity/ReelLike").ReelLikeEntity[];
        reelComment: import("../reel-comment/entity/ReelComment").ReelCommentEntity[];
        shortVideoLikes: import("../short-video-like/entity/ShortVideoLike").ShortVideoLikeEntity[];
        shortVideoComments: import("../short-video-comment/entity/ShortVideoComment").ShortVideoCommentEntity[];
        articleLikes: import("../article-like/entity/ArticleLike").ArticleLike[];
        articleComments: import("../article-comment/entity/ArticleComment").ArticleComment[];
        articleReads: import("../article-reed/entity/ArticleReed").ArticleRead[];
        notifications: import("../notification/entity/Notification").Notification[];
        createdAt: Date;
        success?: undefined;
        message?: undefined;
    }>;
    disapproveTeacherRequest(id: number, body: {
        reasons: string;
    }, req: any): Promise<{
        success: boolean;
        message: string;
    } | {
        disapprovedBy: {
            id: any;
            email: any;
            name: string;
            role: any;
        };
        disapprovedAt: string;
        reasons: string;
        emailSent: boolean;
        emailError: string;
        id: number;
        fName: string;
        lName: string;
        phoneNumber: string;
        active: boolean;
        email: string;
        password: string;
        role: import("./entity/User").UserRole;
        teacher: import("../teacher/entity/Teacher").TeacherEntity;
        student: import("../student/entity/Student").Student;
        reels: import("../reels/entity/Reel").ReelEntity[];
        shortVideos: import("../short-video/entity/ShortVideo").ShortVideoEntity[];
        articles: import("../article/entity/Article").ArticleEntity[];
        reelLikes: import("../reel-like/entity/ReelLike").ReelLikeEntity[];
        reelComment: import("../reel-comment/entity/ReelComment").ReelCommentEntity[];
        shortVideoLikes: import("../short-video-like/entity/ShortVideoLike").ShortVideoLikeEntity[];
        shortVideoComments: import("../short-video-comment/entity/ShortVideoComment").ShortVideoCommentEntity[];
        articleLikes: import("../article-like/entity/ArticleLike").ArticleLike[];
        articleComments: import("../article-comment/entity/ArticleComment").ArticleComment[];
        articleReads: import("../article-reed/entity/ArticleReed").ArticleRead[];
        notifications: import("../notification/entity/Notification").Notification[];
        createdAt: Date;
        success?: undefined;
        message?: undefined;
    }>;
    updateUser(req: any, updateUserDto: UpdateUserDto): any;
    deleteUser(req: any): any;
}
