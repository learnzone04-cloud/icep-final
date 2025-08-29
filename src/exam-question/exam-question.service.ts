import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam-question.dto';
import { ExamQuestion } from './entities/exam-question.entity';
import { Exam } from 'src/exam/entities/exam.entity';

@Injectable()
export class ExamQuestionService {
  constructor(
    @InjectRepository(ExamQuestion)
    private readonly examQuestionRepository: Repository<ExamQuestion>,
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  async create(createExamQuestionDto: CreateExamQuestionDto, examId: number) {
    console.log('Received DTO:', createExamQuestionDto);
    const exam = await this.examRepository.findOne({ where: { id: examId }, relations: ['questions'] });
    if (!exam) throw new Error('Exam not found');

    // Logic for question count and valid
    if (exam.type === 'Mid Exam' || exam.type === 'Final Exam') {
      if (exam.questionCount >= 50) {
        return { message: 'You cannot add more than 50 questions to this exam.' };
      }
      // Add and save the question with a managed exam entity
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
      // Reload the exam from the DB before updating questionCount/valid
      const updatedExam = await this.examRepository.findOne({ where: { id: exam.id } });
      updatedExam.questionCount += 1;
      if (updatedExam.questionCount === 50 && !updatedExam.valid) {
        updatedExam.valid = true;
      }
      await this.examRepository.save(updatedExam);
      return examQuestion;
    } else if (exam.type === 'Specific Video Exam') {
      // 1. Add and save the question first
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
      
      // 2. Reload the exam from the DB before updating valid (same as Mid/Final logic)
      const updatedExam = await this.examRepository.findOne({ where: { id: exam.id } });
      if (!updatedExam.valid) {
        updatedExam.valid = true;
        await this.examRepository.save(updatedExam);
      }
      return examQuestion;
    } else {
      throw new Error('Unknown exam type');
    }
  }

  findAll() {
    return `This action returns all examQuestion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examQuestion`;
  }

  async update(id: number, updateExamQuestionDto: UpdateExamQuestionDto) {
    const examQuestion = await this.examQuestionRepository.findOne({ where: { id }, relations: ['exam'] });
    if (!examQuestion) throw new Error('ExamQuestion not found');
    // Only update fields that are present and part of the entity
    const updatableFields = ['question', 'firstAnswer', 'secondAnswer', 'thirdAnswer', 'fourthAnswer', 'correctAnswer'];
    for (const key of updatableFields) {
      if (updateExamQuestionDto[key] !== undefined) {
        examQuestion[key] = updateExamQuestionDto[key];
      }
    }
    // Handle examId separately
    if (updateExamQuestionDto.examId !== undefined) {
      const exam = await this.examRepository.findOne({ where: { id: updateExamQuestionDto.examId } });
      if (!exam) throw new Error('Exam not found');
      examQuestion.exam = exam;
    }
    return this.examQuestionRepository.save(examQuestion);
  }

  async remove(id: number) {
    const examQuestion = await this.examQuestionRepository.findOne({ where: { id } });
    if (!examQuestion) throw new Error('ExamQuestion not found');
    await this.examQuestionRepository.remove(examQuestion);
    return { message: 'ExamQuestion deleted successfully' };
  }

  async findAllByExamId(examId: number) {
    return this.examQuestionRepository.find({ 
      where: { exam: { id: examId } },
      relations: ['exam']
    });
  }
}
