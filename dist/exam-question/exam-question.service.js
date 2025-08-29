"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamQuestionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exam_question_entity_1 = require("./entities/exam-question.entity");
const exam_entity_1 = require("../exam/entities/exam.entity");
let ExamQuestionService = class ExamQuestionService {
    constructor(examQuestionRepository, examRepository) {
        this.examQuestionRepository = examQuestionRepository;
        this.examRepository = examRepository;
    }
    async create(createExamQuestionDto, examId) {
        console.log('Received DTO:', createExamQuestionDto);
        const exam = await this.examRepository.findOne({ where: { id: examId }, relations: ['questions'] });
        if (!exam)
            throw new Error('Exam not found');
        if (exam.type === 'Mid Exam' || exam.type === 'Final Exam') {
            if (exam.questionCount >= 50) {
                return { message: 'You cannot add more than 50 questions to this exam.' };
            }
            const examQuestion = this.examQuestionRepository.create({
                question: createExamQuestionDto.question,
                firstAnswer: createExamQuestionDto.firstAnswer,
                secondAnswer: createExamQuestionDto.secondAnswer,
                thirdAnswer: createExamQuestionDto.thirdAnswer,
                fourthAnswer: createExamQuestionDto.fourthAnswer,
                correctAnswer: createExamQuestionDto.correctAnswer,
                exam: exam,
            });
            await this.examQuestionRepository.save(examQuestion);
            const updatedExam = await this.examRepository.findOne({ where: { id: exam.id } });
            updatedExam.questionCount += 1;
            if (updatedExam.questionCount === 50 && !updatedExam.valid) {
                updatedExam.valid = true;
            }
            await this.examRepository.save(updatedExam);
            return examQuestion;
        }
        else if (exam.type === 'Specific Video Exam') {
            const examQuestion = this.examQuestionRepository.create({
                question: createExamQuestionDto.question,
                firstAnswer: createExamQuestionDto.firstAnswer,
                secondAnswer: createExamQuestionDto.secondAnswer,
                thirdAnswer: createExamQuestionDto.thirdAnswer,
                fourthAnswer: createExamQuestionDto.fourthAnswer,
                correctAnswer: createExamQuestionDto.correctAnswer,
                exam: exam,
            });
            await this.examQuestionRepository.save(examQuestion);
            const updatedExam = await this.examRepository.findOne({ where: { id: exam.id } });
            if (!updatedExam.valid) {
                updatedExam.valid = true;
                await this.examRepository.save(updatedExam);
            }
            return examQuestion;
        }
        else {
            throw new Error('Unknown exam type');
        }
    }
    findAll() {
        return `This action returns all examQuestion`;
    }
    findOne(id) {
        return `This action returns a #${id} examQuestion`;
    }
    async update(id, updateExamQuestionDto) {
        const examQuestion = await this.examQuestionRepository.findOne({ where: { id }, relations: ['exam'] });
        if (!examQuestion)
            throw new Error('ExamQuestion not found');
        const updatableFields = ['question', 'firstAnswer', 'secondAnswer', 'thirdAnswer', 'fourthAnswer', 'correctAnswer'];
        for (const key of updatableFields) {
            if (updateExamQuestionDto[key] !== undefined) {
                examQuestion[key] = updateExamQuestionDto[key];
            }
        }
        if (updateExamQuestionDto.examId !== undefined) {
            const exam = await this.examRepository.findOne({ where: { id: updateExamQuestionDto.examId } });
            if (!exam)
                throw new Error('Exam not found');
            examQuestion.exam = exam;
        }
        return this.examQuestionRepository.save(examQuestion);
    }
    async remove(id) {
        const examQuestion = await this.examQuestionRepository.findOne({ where: { id } });
        if (!examQuestion)
            throw new Error('ExamQuestion not found');
        await this.examQuestionRepository.remove(examQuestion);
        return { message: 'ExamQuestion deleted successfully' };
    }
    async findAllByExamId(examId) {
        return this.examQuestionRepository.find({
            where: { exam: { id: examId } },
            relations: ['exam']
        });
    }
};
exports.ExamQuestionService = ExamQuestionService;
exports.ExamQuestionService = ExamQuestionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exam_question_entity_1.ExamQuestion)),
    __param(1, (0, typeorm_1.InjectRepository)(exam_entity_1.Exam)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ExamQuestionService);
//# sourceMappingURL=exam-question.service.js.map