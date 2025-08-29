import { Student } from '../../student/entity/Student';
import { Course } from '../../course/entities/course.entity';
import { CourseVideoEntity } from '../../course-video/entity/course-video.entity';
export declare class CourseVideoProgress {
    id: number;
    studentId: number;
    courseId: number;
    videoId: number;
    videoNumber: number;
    isUnlocked: boolean;
    isWatched: boolean;
    student: Student;
    course: Course;
    video: CourseVideoEntity;
}
