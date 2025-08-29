import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamQuestionService } from './exam-question.service';
import { ExamQuestionController } from './exam-question.controller';
import { ExamQuestion } from './entities/exam-question.entity';
import { Exam } from 'src/exam/entities/exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamQuestion, Exam])],
  controllers: [ExamQuestionController],
  providers: [ExamQuestionService],
})
export class ExamQuestionModule {}
