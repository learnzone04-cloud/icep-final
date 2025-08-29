import { Repository } from 'typeorm';
import { ExamStudent } from './exam-student.entity';
import { Student } from '../student/entity/Student';
import { Exam } from '../exam/entities/exam.entity';
import { EnrollCourseStudent } from '../enroll-course-student/entity/EnrollCourseStudent.entity';
import { CourseVideoProgressService } from '../course-video-progress/course-video-progress.service';
export declare class ExamStudentService {
    private readonly examStudentRepo;
    private readonly studentRepo;
    private readonly examRepo;
    private readonly enrollCourseStudentRepo;
    private readonly courseVideoProgressService;
    constructor(examStudentRepo: Repository<ExamStudent>, studentRepo: Repository<Student>, examRepo: Repository<Exam>, enrollCourseStudentRepo: Repository<EnrollCourseStudent>, courseVideoProgressService: CourseVideoProgressService);
    setMark(examId: number, userId: number, mark: number): Promise<{
        message: string;
        examStudent?: undefined;
    } | {
        message: string;
        examStudent: ExamStudent;
    }>;
}
