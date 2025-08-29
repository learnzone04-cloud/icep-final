"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("./users/entity/User");
const teacher_module_1 = require("./teacher/teacher.module");
const types_module_1 = require("./types/types.module");
const Teacher_1 = require("./teacher/entity/Teacher");
const Type_1 = require("./types/entity/Type");
const reels_module_1 = require("./reels/reels.module");
const Reel_1 = require("./reels/entity/Reel");
const reel_like_module_1 = require("./reel-like/reel-like.module");
const ReelLike_1 = require("./reel-like/entity/ReelLike");
const reel_comment_module_1 = require("./reel-comment/reel-comment.module");
const ReelComment_1 = require("./reel-comment/entity/ReelComment");
const article_module_1 = require("./article/article.module");
const Article_1 = require("./article/entity/Article");
const article_like_module_1 = require("./article-like/article-like.module");
const ArticleLike_1 = require("./article-like/entity/ArticleLike");
const article_comment_module_1 = require("./article-comment/article-comment.module");
const ArticleComment_1 = require("./article-comment/entity/ArticleComment");
const article_reed_module_1 = require("./article-reed/article-reed.module");
const ArticleReed_1 = require("./article-reed/entity/ArticleReed");
const student_module_1 = require("./student/student.module");
const Student_1 = require("./student/entity/Student");
const new_word_module_1 = require("./new-word/new-word.module");
const NewWord_1 = require("./new-word/entity/NewWord");
const student_type_module_1 = require("./student-type/student-type.module");
const StudentType_1 = require("./student-type/entity/StudentType");
const follower_module_1 = require("./follower/follower.module");
const follower_entity_1 = require("./follower/entities/follower.entity");
const rate_module_1 = require("./rate/rate.module");
const certificate_entity_1 = require("./certificate/entities/certificate.entity");
const course_module_1 = require("./course/course.module");
const course_entity_1 = require("./course/entities/course.entity");
const youtube_module_1 = require("./youtube/youtube.module");
const course_video_module_1 = require("./course-video/course-video.module");
const course_video_entity_1 = require("./course-video/entity/course-video.entity");
const stripe_service_1 = require("./stripe/stripe.service");
const stripe_controller_1 = require("./stripe/stripe.controller");
const stripe_module_1 = require("./stripe/stripe.module");
const exam_module_1 = require("./exam/exam.module");
const exam_question_module_1 = require("./exam-question/exam-question.module");
const exam_entity_1 = require("./exam/entities/exam.entity");
const exam_question_entity_1 = require("./exam-question/entities/exam-question.entity");
const placement_test_module_1 = require("./placement-test/placement-test.module");
const placement_test_entity_1 = require("./placement-test/placement-test.entity");
const hub_module_1 = require("./hub/hub.module");
const hub_message_entity_1 = require("./hub/entities/hub-message.entity");
const search_module_1 = require("./search/search.module");
const enroll_course_student_module_1 = require("./enroll-course-student/enroll-course-student.module");
const EnrollCourseStudent_entity_1 = require("./enroll-course-student/entity/EnrollCourseStudent.entity");
const exam_student_entity_1 = require("./exam-student/exam-student.entity");
const exam_student_module_1 = require("./exam-student/exam-student.module");
const CourseVideoProgress_entity_1 = require("./course-video-progress/entity/CourseVideoProgress.entity");
const course_video_progress_module_1 = require("./course-video-progress/course-video-progress.module");
const notes_module_1 = require("./notes/notes.module");
const Note_1 = require("./notes/entity/Note");
const NoteContext_1 = require("./notes/entity/NoteContext");
const saved_article_module_1 = require("./saved-article/saved-article.module");
const SavedArticle_1 = require("./saved-article/entity/SavedArticle");
const ConversationRoom_1 = require("./conversation-room/entity/ConversationRoom");
const ConversationRoomParticipant_1 = require("./conversation-room/entity/ConversationRoomParticipant");
const conversation_room_module_1 = require("./conversation-room/conversation-room.module");
const Notification_1 = require("./notification/entity/Notification");
const notification_module_1 = require("./notification/notification.module");
const Story_1 = require("./story/entity/Story");
const StoryLike_1 = require("./story/entity/StoryLike");
const story_module_1 = require("./story/story.module");
const ShortVideo_1 = require("./short-video/entity/ShortVideo");
const ShortVideoLike_1 = require("./short-video-like/entity/ShortVideoLike");
const ShortVideoComment_1 = require("./short-video-comment/entity/ShortVideoComment");
const short_video_module_1 = require("./short-video/short-video.module");
const short_video_like_module_1 = require("./short-video-like/short-video-like.module");
const short_video_comment_module_1 = require("./short-video-comment/short-video-comment.module");
const admin_auth_module_1 = require("./admin-auth/admin-auth.module");
const lesson_module_1 = require("./lesson/lesson.module");
const Lesson_1 = require("./lesson/entity/Lesson");
const LessonReschedule_1 = require("./lesson/entity/LessonReschedule");
const gmail_module_1 = require("./gmail/gmail.module");
const chat_entity_1 = require("./chat/entities/chat.entity");
const chat_message_entity_1 = require("./chat/entities/chat-message.entity");
const chat_module_1 = require("./chat/chat.module");
const schedule_1 = require("@nestjs/schedule");
const rate_entity_1 = require("./rate/entities/rate.entity");
const statistics_module_1 = require("./statistics/statistics.module");
const discounts_module_1 = require("./discounts/discounts.module");
const discount_entity_1 = require("./discounts/entities/discount.entity");
const coupon_entity_1 = require("./discounts/entities/coupon.entity");
const recommendation_module_1 = require("./recommendation/recommendation.module");
const tags_module_1 = require("./tags/tags.module");
const UserInteraction_1 = require("./recommendation/entities/UserInteraction");
const UserProfile_1 = require("./recommendation/entities/UserProfile");
const UserRecommendation_1 = require("./recommendation/entities/UserRecommendation");
const UserTagPreference_1 = require("./recommendation/entities/UserTagPreference");
const Tag_1 = require("./tags/entities/Tag");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    type: 'mysql',
                    host: configService.get('MYSQLHOST') ||
                        configService.get('DB_HOST') ||
                        'localhost',
                    port: parseInt((configService.get('MYSQLPORT') ||
                        configService.get('DB_PORT') ||
                        '3306'), 10),
                    username: configService.get('MYSQLUSER') ||
                        configService.get('DB_USERNAME') ||
                        'root',
                    password: configService.get('MYSQLPASSWORD') ||
                        configService.get('DB_PASSWORD') ||
                        '',
                    database: configService.get('MYSQLDATABASE') ||
                        configService.get('DB_DATABASE') ||
                        'railway',
                    entities: [
                        User_1.UserEntity,
                        Teacher_1.TeacherEntity,
                        Type_1.TypeEntity,
                        Reel_1.ReelEntity,
                        ReelLike_1.ReelLikeEntity,
                        ReelComment_1.ReelCommentEntity,
                        Article_1.ArticleEntity,
                        ArticleLike_1.ArticleLike,
                        ArticleComment_1.ArticleComment,
                        ArticleReed_1.ArticleRead,
                        Student_1.Student,
                        NewWord_1.NewWord,
                        StudentType_1.StudentType,
                        follower_entity_1.Follower,
                        certificate_entity_1.CertificateEntity,
                        course_entity_1.Course,
                        course_video_entity_1.CourseVideoEntity,
                        exam_entity_1.Exam,
                        exam_question_entity_1.ExamQuestion,
                        placement_test_entity_1.PlacementTest,
                        hub_message_entity_1.HubMessage,
                        EnrollCourseStudent_entity_1.EnrollCourseStudent,
                        exam_student_entity_1.ExamStudent,
                        CourseVideoProgress_entity_1.CourseVideoProgress,
                        Note_1.Note,
                        NoteContext_1.NoteContext,
                        SavedArticle_1.SavedArticle,
                        ConversationRoom_1.ConversationRoom,
                        ConversationRoomParticipant_1.ConversationRoomParticipant,
                        Notification_1.Notification,
                        Story_1.Story,
                        StoryLike_1.StoryLike,
                        ShortVideo_1.ShortVideoEntity,
                        ShortVideoLike_1.ShortVideoLikeEntity,
                        ShortVideoComment_1.ShortVideoCommentEntity,
                        Lesson_1.Lesson,
                        LessonReschedule_1.LessonReschedule,
                        chat_entity_1.Chat,
                        chat_message_entity_1.ChatMessage,
                        rate_entity_1.Rate,
                        discount_entity_1.Discount,
                        coupon_entity_1.Coupon,
                        UserInteraction_1.UserInteraction,
                        UserProfile_1.UserProfile,
                        UserRecommendation_1.UserRecommendation,
                        UserTagPreference_1.UserTagPreference,
                        Tag_1.Tag,
                    ],
                    synchronize: true,
                }),
                inject: [config_1.ConfigService],
            }),
            schedule_1.ScheduleModule.forRoot(),
            users_module_1.UsersModule,
            teacher_module_1.TeacherModule,
            types_module_1.TypesModule,
            reels_module_1.ReelsModule,
            reel_like_module_1.ReelLikeModule,
            reel_comment_module_1.ReelCommentModule,
            article_module_1.ArticleModule,
            article_like_module_1.ArticleLikeModule,
            article_comment_module_1.ArticleCommentModule,
            article_reed_module_1.ArticleReedModule,
            student_module_1.StudentModule,
            new_word_module_1.NewWordModule,
            student_type_module_1.StudentTypeModule,
            follower_module_1.FollowerModule,
            rate_module_1.RateModule,
            course_module_1.CourseModule,
            youtube_module_1.YoutubeModule,
            course_video_module_1.CourseVideoModule,
            exam_module_1.ExamModule,
            exam_question_module_1.ExamQuestionModule,
            placement_test_module_1.PlacementTestModule,
            hub_module_1.HubModule,
            search_module_1.SearchModule,
            enroll_course_student_module_1.EnrollCourseStudentModule,
            exam_student_module_1.ExamStudentModule,
            course_video_progress_module_1.CourseVideoProgressModule,
            notes_module_1.NotesModule,
            saved_article_module_1.SavedArticleModule,
            conversation_room_module_1.ConversationRoomModule,
            notification_module_1.NotificationModule,
            story_module_1.StoryModule,
            short_video_module_1.ShortVideoModule,
            short_video_like_module_1.ShortVideoLikeModule,
            short_video_comment_module_1.ShortVideoCommentModule,
            admin_auth_module_1.AdminAuthModule,
            lesson_module_1.LessonModule,
            gmail_module_1.GmailModule,
            chat_module_1.ChatModule,
            statistics_module_1.StatisticsModule,
            discounts_module_1.DiscountsModule,
            stripe_module_1.StripeModule,
            recommendation_module_1.RecommendationModule,
            tags_module_1.TagsModule,
        ],
        controllers: [stripe_controller_1.StripeController],
        providers: [stripe_service_1.StripeService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map