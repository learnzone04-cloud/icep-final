import { Course } from 'src/course/entities/course.entity';
import { CourseVideoEntity } from 'src/course-video/entity/course-video.entity';
import { ExamQuestion } from 'src/exam-question/entities/exam-question.entity';
import { ExamStudent } from '../../exam-student/exam-student.entity';
export declare enum ExamType {
    MidExam = "Mid Exam",
    FinalExam = "Final Exam",
    SpecificVideoExam = "Specific Video Exam"
}
export declare class Exam {
    id: number;
    type: ExamType;
    courseId: number;
    course: Course;
    video?: CourseVideoEntity;
    label?: string;
    readonly numberOfQuestions: number;
    questionCount: number;
    valid: boolean;
    questions: ExamQuestion[];
    examStudents: ExamStudent[];
}
