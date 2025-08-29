import { Follower } from 'src/follower/entities/follower.entity';
import { NewWord } from 'src/new-word/entity/NewWord';
import { StudentType } from 'src/student-type/entity/StudentType';
import { UserEntity } from 'src/users/entity/User';
import { EnrollCourseStudent } from 'src/enroll-course-student/entity/EnrollCourseStudent.entity';
import { ExamStudent } from '../../exam-student/exam-student.entity';
import { Note } from 'src/notes/entity/Note';
import { SavedArticle } from 'src/saved-article/entity/SavedArticle';
import { ConversationRoomParticipant } from '../../conversation-room/entity/ConversationRoomParticipant';
import { StoryLike } from '../../story/entity/StoryLike';
import { Rate } from 'src/rate/entities/rate.entity';
export declare class Student {
    id: number;
    userId: number;
    work?: string;
    user: UserEntity;
    words: NewWord[];
    followers: Follower[];
    studentTypes: StudentType[];
    enrollments: EnrollCourseStudent[];
    examStudents: ExamStudent[];
    notes: Note[];
    savedArticles: SavedArticle[];
    conversationRoomParticipations: ConversationRoomParticipant[];
    storyLikes: StoryLike[];
    rates: Rate[];
}
