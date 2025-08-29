import { CourseVideoEntity } from 'src/course-video/entity/course-video.entity';
import { TeacherEntity } from 'src/teacher/entity/Teacher';
import { TypeEntity } from 'src/types/entity/Type';
import { Exam } from 'src/exam/entities/exam.entity';
import { EnrollCourseStudent } from 'src/enroll-course-student/entity/EnrollCourseStudent.entity';
import { PlacementLevel } from '../../placement-test/placement-test.entity';
export declare class Course {
    id: number;
    teacherId: number;
    typeId: number;
    title: string;
    description: string;
    tags: string;
    duration: string;
    price: number;
    videosNumber: number;
    readonly currency: string;
    examCount: number;
    maxGrade: number;
    passGrade: number;
    hasPassFailSystem: boolean;
    level: PlacementLevel;
    teacher: TeacherEntity;
    type: TypeEntity;
    courseVideos: CourseVideoEntity;
    exams: Exam[];
    enrollments: EnrollCourseStudent[];
}
