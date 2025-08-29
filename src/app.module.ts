import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entity/User';
import { TeacherModule } from './teacher/teacher.module';
import { TypesModule } from './types/types.module';
import { TeacherEntity } from './teacher/entity/Teacher';
import { TypeEntity } from './types/entity/Type';
import { ReelsModule } from './reels/reels.module';
import { ReelEntity } from './reels/entity/Reel';
import { ReelLikeModule } from './reel-like/reel-like.module';
import { ReelLikeEntity } from './reel-like/entity/ReelLike';
import { ReelCommentModule } from './reel-comment/reel-comment.module';
import { ReelCommentEntity } from './reel-comment/entity/ReelComment';
import { ArticleModule } from './article/article.module';
import { ArticleEntity } from './article/entity/Article';
import { ArticleLikeModule } from './article-like/article-like.module';
import { ArticleLike } from './article-like/entity/ArticleLike';
import { ArticleCommentModule } from './article-comment/article-comment.module';
import { ArticleComment } from './article-comment/entity/ArticleComment';
import { ArticleReedModule } from './article-reed/article-reed.module';
import { ArticleRead } from './article-reed/entity/ArticleReed';
import { StudentModule } from './student/student.module';
import { Student } from './student/entity/Student';
import { NewWordModule } from './new-word/new-word.module';
import { NewWord } from './new-word/entity/NewWord';
import { StudentTypeModule } from './student-type/student-type.module';
import { StudentType } from './student-type/entity/StudentType';
import { FollowerModule } from './follower/follower.module';
import { Follower } from './follower/entities/follower.entity';
import { RateModule } from './rate/rate.module';
import { CertificateEntity } from './certificate/entities/certificate.entity';
import { CourseModule } from './course/course.module';
import { Course } from './course/entities/course.entity';
import { YoutubeService } from './youtube/youtube.service';
import { YoutubeController } from './youtube/youtube.controller';
import { YoutubeModule } from './youtube/youtube.module';
import { CourseVideoModule } from './course-video/course-video.module';
import { CourseVideoEntity } from './course-video/entity/course-video.entity';
import { StripeService } from './stripe/stripe.service';
import { StripeController } from './stripe/stripe.controller';
import { StripeModule } from './stripe/stripe.module';
import { ExamModule } from './exam/exam.module';
import { ExamQuestionModule } from './exam-question/exam-question.module';
import { Exam } from './exam/entities/exam.entity';
import { ExamQuestion } from './exam-question/entities/exam-question.entity';
import { PlacementTestModule } from './placement-test/placement-test.module';
import { PlacementTest } from './placement-test/placement-test.entity';
import { HubModule } from './hub/hub.module';
import { HubMessage } from './hub/entities/hub-message.entity';
import { SearchModule } from './search/search.module';
import { EnrollCourseStudentModule } from './enroll-course-student/enroll-course-student.module';
import { EnrollCourseStudent } from './enroll-course-student/entity/EnrollCourseStudent.entity';
import { ExamStudent } from './exam-student/exam-student.entity';
import { ExamStudentModule } from './exam-student/exam-student.module';
import { CourseVideoProgress } from './course-video-progress/entity/CourseVideoProgress.entity';
import { CourseVideoProgressModule } from './course-video-progress/course-video-progress.module';
import { NotesModule } from './notes/notes.module';
import { Note } from './notes/entity/Note';
import { NoteContext } from './notes/entity/NoteContext';
import { SavedArticleModule } from './saved-article/saved-article.module';
import { SavedArticle } from './saved-article/entity/SavedArticle';
import { ConversationRoom } from './conversation-room/entity/ConversationRoom';
import { ConversationRoomParticipant } from './conversation-room/entity/ConversationRoomParticipant';
import { ConversationRoomModule } from './conversation-room/conversation-room.module';
import { Notification } from './notification/entity/Notification';
import { NotificationModule } from './notification/notification.module';
import { Story } from './story/entity/Story';
import { StoryLike } from './story/entity/StoryLike';
import { StoryModule } from './story/story.module';
import { ShortVideoEntity } from './short-video/entity/ShortVideo';
import { ShortVideoLikeEntity } from './short-video-like/entity/ShortVideoLike';
import { ShortVideoCommentEntity } from './short-video-comment/entity/ShortVideoComment';
import { ShortVideoModule } from './short-video/short-video.module';
import { ShortVideoLikeModule } from './short-video-like/short-video-like.module';
import { ShortVideoCommentModule } from './short-video-comment/short-video-comment.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { LessonModule } from './lesson/lesson.module';
import { Lesson } from './lesson/entity/Lesson';
import { LessonReschedule } from './lesson/entity/LessonReschedule';
import { GmailModule } from './gmail/gmail.module';
import { Chat } from './chat/entities/chat.entity';
import { ChatMessage } from './chat/entities/chat-message.entity';
import { ChatModule } from './chat/chat.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Rate } from './rate/entities/rate.entity';
import { StatisticsModule } from './statistics/statistics.module';
import { DiscountsModule } from './discounts/discounts.module';
import { Discount } from './discounts/entities/discount.entity';
import { Coupon } from './discounts/entities/coupon.entity';
import { RecommendationModule } from './recommendation/recommendation.module';
import { TagsModule } from './tags/tags.module';
import { UserInteraction } from './recommendation/entities/UserInteraction';
import { UserProfile } from './recommendation/entities/UserProfile';
import { UserRecommendation } from './recommendation/entities/UserRecommendation';
import { UserTagPreference } from './recommendation/entities/UserTagPreference';
import { Tag } from './tags/entities/Tag';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: 'railway',
      port: 3306,
      host: 'mysql.railway.internal',
      username: 'root',
      password: 'nRaViaggQXZFHCJLVUFbsunQVMclcLGA',
      entities: [
        UserEntity,
        TeacherEntity,
        TypeEntity,
        ReelEntity,
        ReelLikeEntity,
        ReelCommentEntity,
        ArticleEntity,
        ArticleLike,
        ArticleComment,
        ArticleRead,
        Student,
        NewWord,
        StudentType,
        Follower,
        CertificateEntity,
        Course,
        CourseVideoEntity,
        Exam,            
        ExamQuestion,
        PlacementTest,
        HubMessage,
        EnrollCourseStudent,
        ExamStudent,
        CourseVideoProgress,
        Note,
        NoteContext,
        SavedArticle,
        ConversationRoom,
        ConversationRoomParticipant,
        Notification,
        Story,
        StoryLike,
        ShortVideoEntity,
        ShortVideoLikeEntity,
        ShortVideoCommentEntity,
        Lesson,
        LessonReschedule,
        Chat,
        ChatMessage,
        Rate,
        Discount,
        Coupon,
        UserInteraction,
        UserProfile,
        UserRecommendation,
        UserTagPreference,
        Tag,
      ],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    TeacherModule,
    TypesModule,
    ReelsModule,
    ReelLikeModule,
    ReelCommentModule,
    ArticleModule,
    ArticleLikeModule,
    ArticleCommentModule,
    ArticleReedModule,
    StudentModule,
    NewWordModule,
    StudentTypeModule,
    FollowerModule,
    RateModule,
    CourseModule,
    YoutubeModule,
    CourseVideoModule,
    ExamModule,
    ExamQuestionModule,
    PlacementTestModule,
    HubModule,
    SearchModule,
    EnrollCourseStudentModule,
    ExamStudentModule,
    CourseVideoProgressModule,
    NotesModule,
    SavedArticleModule,
    ConversationRoomModule,
    NotificationModule,
    StoryModule,
    ShortVideoModule,
    ShortVideoLikeModule,
    ShortVideoCommentModule,
    AdminAuthModule,
    LessonModule,
    GmailModule,
    ChatModule,
    StatisticsModule,
    DiscountsModule,
    StripeModule,
    RecommendationModule,
    TagsModule,
  ],
  controllers: [StripeController],
  providers: [StripeService],
})
export class AppModule {}
