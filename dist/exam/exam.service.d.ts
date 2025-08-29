import { Repository, DataSource } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './entities/exam.entity';
import { CourseService } from 'src/course/course.service';
import { CourseVideoEntity } from 'src/course-video/entity/course-video.entity';
import { ExamQuestion } from 'src/exam-question/entities/exam-question.entity';
import { ExamStudent } from 'src/exam-student/exam-student.entity';
import { Student } from 'src/student/entity/Student';
import { TeacherEntity } from 'src/teacher/entity/Teacher';
export declare class ExamService {
    private examRepository;
    private courseService;
    private videoRepository;
    private examQuestionRepository;
    private examStudentRepository;
    private studentRepository;
    private teacherRepository;
    private dataSource;
    constructor(examRepository: Repository<Exam>, courseService: CourseService, videoRepository: Repository<CourseVideoEntity>, examQuestionRepository: Repository<ExamQuestion>, examStudentRepository: Repository<ExamStudent>, studentRepository: Repository<Student>, teacherRepository: Repository<TeacherEntity>, dataSource: DataSource);
    create(createExamDto: CreateExamDto): Promise<Exam>;
    update(id: number, updateExamDto: UpdateExamDto): Promise<Exam>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getSpecificVideoExam(videoId: number, courseId: number): Promise<Exam>;
    getStudentMidFinalExams(userId: number, courseId: number): Promise<{
        midExams: {
            examId: number;
            examType: string;
            mark: number;
            exam: Exam;
        }[];
        finalExams: {
            examId: number;
            examType: string;
            mark: number;
            exam: Exam;
        }[];
    }>;
    getExamsByTeacherAndCourse(teacherId: number, courseId: number): Promise<Exam[]>;
}
