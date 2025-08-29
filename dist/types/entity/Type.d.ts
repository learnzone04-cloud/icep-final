import { ArticleEntity } from 'src/article/entity/Article';
import { ConversationRoom } from 'src/conversation-room/entity/ConversationRoom';
import { Course } from 'src/course/entities/course.entity';
import { ReelEntity } from 'src/reels/entity/Reel';
import { ShortVideoEntity } from 'src/short-video/entity/ShortVideo';
import { StudentType } from 'src/student-type/entity/StudentType';
import { TeacherEntity } from 'src/teacher/entity/Teacher';
import { Tag } from 'src/tags/entities/Tag';
export declare class TypeEntity {
    id: number;
    name: string;
    teachers: TeacherEntity[];
    reels: ReelEntity[];
    shortVideos: ShortVideoEntity[];
    studentTypes: StudentType[];
    createdAt: Date;
    course: Course;
    articles: ArticleEntity[];
    conversationRooms: ConversationRoom[];
    tags: Tag[];
}
