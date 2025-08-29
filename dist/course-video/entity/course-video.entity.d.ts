import { Course } from 'src/course/entities/course.entity';
import { Exam } from 'src/exam/entities/exam.entity';
export declare class CourseVideoEntity {
    id: number;
    courseId: number;
    youtubeVideoId: string;
    title: string;
    description: string;
    thumbnail_url: string;
    path: string;
    approaved: boolean;
    privacyStatus: string;
    videoUrl: string;
    number: number;
    course: Course;
    exams: Exam[];
}
