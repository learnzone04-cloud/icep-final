import { Student } from 'src/student/entity/Student';
import { Course } from 'src/course/entities/course.entity';
export declare class EnrollCourseStudent {
    id: number;
    studentId: number;
    courseId: number;
    enrollDate: Date;
    isPass: boolean;
    mark: number | null;
    student: Student;
    course: Course;
}
