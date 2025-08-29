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
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  work?: string;

  @OneToOne(() => UserEntity, (user) => user.student)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => NewWord, (user) => user.student)
  words: NewWord[];

  @OneToMany(() => Follower, (user) => user.student)
  followers: Follower[];

  @OneToMany(() => StudentType, (user) => user.student)
  studentTypes: StudentType[];

  @OneToMany(() => EnrollCourseStudent, (enrollment) => enrollment.student)
  enrollments: EnrollCourseStudent[];

  @OneToMany(() => ExamStudent, (examStudent) => examStudent.student)
  examStudents: ExamStudent[];

  @OneToMany(() => Note, (note) => note.student)
  notes: Note[];

  @OneToMany(() => SavedArticle, (savedArticle) => savedArticle.student)
  savedArticles: SavedArticle[];

  @OneToMany(() => ConversationRoomParticipant, participation => participation.student)
  conversationRoomParticipations: ConversationRoomParticipant[];

  @OneToMany(() => StoryLike, like => like.student)
  storyLikes: StoryLike[];

  @OneToMany(() => Rate, (rate) => rate.student)
  rates: Rate[];
}
