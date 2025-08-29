import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './entities/exam.entity';
export declare class ExamController {
    private readonly examService;
    constructor(examService: ExamService);
    create(createExamDto: CreateExamDto): Promise<Exam>;
    update(id: string, updateExamDto: UpdateExamDto): Promise<Exam>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getSpecificVideoExam(videoId: number, courseId: number): Promise<Exam>;
    getStudentMidFinalExams(courseId: number, req: any): Promise<{
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
    getExamsByTeacherAndCourse(req: any, courseId: number): Promise<Exam[]>;
}
