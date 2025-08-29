import { ExamQuestionService } from './exam-question.service';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam-question.dto';
export declare class ExamQuestionController {
    private readonly examQuestionService;
    constructor(examQuestionService: ExamQuestionService);
    create(createExamQuestionDto: CreateExamQuestionDto, examId: string): Promise<import("./entities/exam-question.entity").ExamQuestion | {
        message: string;
    }>;
    findAll(): string;
    findAllByExamId(examId: string): Promise<import("./entities/exam-question.entity").ExamQuestion[]>;
    findOne(id: string): string;
    update(id: string, updateExamQuestionDto: UpdateExamQuestionDto): Promise<import("./entities/exam-question.entity").ExamQuestion>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
