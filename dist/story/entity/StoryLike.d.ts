import { Story } from './Story';
import { Student } from '../../student/entity/Student';
export declare class StoryLike {
    id: number;
    storyId: number;
    studentId: number;
    createdAt: Date;
    story: Story;
    student: Student;
}
