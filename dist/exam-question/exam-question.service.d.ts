import { Repository } from 'typeorm';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam-question.dto';
import { ExamQuestion } from './entities/exam-question.entity';
import { Exam } from 'src/exam/entities/exam.entity';
export declare class ExamQuestionService {
    private readonly examQuestionRepository;
    private readonly examRepository;
    constructor(examQuestionRepository: Repository<ExamQuestion>, examRepository: Repository<Exam>);
    create(createExamQuestionDto: CreateExamQuestionDto, examId: number): Promise<ExamQuestion | {
        message: string;
    }>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateExamQuestionDto: UpdateExamQuestionDto): Promise<ExamQuestion>;
    remove(id: number): Promise<{
        message: string;
    }>;
    findAllByExamId(examId: number): Promise<ExamQuestion[]>;
}
