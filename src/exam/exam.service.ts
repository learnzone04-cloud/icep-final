// src/exam/exam.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam, ExamType } from './entities/exam.entity';
import { CourseService } from 'src/course/course.service';
import { CourseVideoEntity } from 'src/course-video/entity/course-video.entity';
import { ExamQuestion } from 'src/exam-question/entities/exam-question.entity';
import { ExamStudent } from 'src/exam-student/exam-student.entity';
import { Student } from 'src/student/entity/Student';
import { TeacherEntity } from 'src/teacher/entity/Teacher';
import { In } from 'typeorm';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam) private examRepository: Repository<Exam>,
    private courseService: CourseService,
    @InjectRepository(CourseVideoEntity) private videoRepository: Repository<CourseVideoEntity>,
    @InjectRepository(ExamQuestion) private examQuestionRepository: Repository<ExamQuestion>,
    @InjectRepository(ExamStudent) private examStudentRepository: Repository<ExamStudent>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(TeacherEntity) private teacherRepository: Repository<TeacherEntity>,
    private dataSource: DataSource,
  ) {}

  async create(createExamDto: CreateExamDto) {
    // Check if course exists
    const courseExists = await this.courseService.findOne(createExamDto.courseId);
    if (!courseExists) {
      throw new Error('Course not found');
    }

    // Validate exam limits based on type
    let label = null;
    if (createExamDto.type === 'Mid Exam' || createExamDto.type === 'Final Exam') {
      const existingExams = await this.examRepository.find({
        where: { 
          courseId: createExamDto.courseId, 
          type: createExamDto.type 
        }
      });
      
      if (existingExams.length >= 2) {
        throw new Error(`Cannot create more than 2 ${createExamDto.type}s for this course`);
      }
      label = existingExams.length === 0 ? 'A' : 'B';
    }
    // For Specific Video Exam, label remains null

    // If a videoId is provided, check if it belongs to the course
    if (createExamDto.videoId) {
      const video = await this.videoRepository.findOne({
        where: { id: Number(createExamDto.videoId), courseId: Number(createExamDto.courseId) },
      });
      if (!video) {
        throw new Error('Video not found or does not belong to the specified course');
      }
      
      // Check if there's already an exam for this video
      const existingVideoExam = await this.examRepository.findOne({
        where: { 
          courseId: createExamDto.courseId, 
          video: { id: Number(createExamDto.videoId) }
        }
      });
      
      if (existingVideoExam) {
        throw new Error('An exam already exists for this video');
      }
    }

    // Create and save the exam
    const exam = this.examRepository.create({ ...createExamDto, label });
    // Set the video relation if it exists
    if (createExamDto.videoId) {
      exam.video = await this.videoRepository.findOne({ where: { id: Number(createExamDto.videoId) } });
    }
    
    const savedExam = await this.examRepository.save(exam);

    // Increment examCount on the course
    courseExists.examCount = (courseExists.examCount || 0) + 1;
    await this.courseService.update(courseExists.id, { examCount: courseExists.examCount });

    // Return saved exam
    return savedExam;
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    const exam = await this.examRepository.findOne({ where: { id } });
    if (!exam) throw new Error('Exam not found');
    Object.assign(exam, updateExamDto);
    return this.examRepository.save(exam);
  }

  async remove(id: number) {
    const exam = await this.examRepository.findOne({ where: { id } });
    if (!exam) throw new Error('Exam not found');
    // Use transaction to delete related ExamQuestions and then Exam
    await this.dataSource.transaction(async manager => {
      await manager.delete(ExamQuestion, { exam: { id } });
      await manager.delete(Exam, { id });
    });
    return { message: 'Exam and related ExamQuestions deleted successfully' };
  }

  async getSpecificVideoExam(videoId: number, courseId: number) {
    const exam = await this.examRepository.findOne({
      where: {
        type: ExamType.SpecificVideoExam,
        courseId: courseId,
        video: { id: videoId }
      },
      relations: ['video', 'questions'],
    });

    if (!exam) {
      throw new NotFoundException('Specific video exam not found');
    }

    return exam;
  }

  async getStudentMidFinalExams(userId: number, courseId: number) {
    // Find the student
    const student = await this.studentRepository.findOne({ where: { userId } });
    if (!student) {
      throw new BadRequestException('Student not found');
    }

    console.log('Student found:', student);
    console.log('Course ID:', courseId);
    const examStudents = await this.examStudentRepository.find({
      where: {
        studentId: student.id,
        courseId: courseId,
        examType: In(['Mid Exam', 'Final Exam'])
      },
      relations: ['exam', 'exam.questions'],
    });

    // Group by exam type
    const midExams = examStudents.filter(es => es.examType === 'Mid Exam');
    const finalExams = examStudents.filter(es => es.examType === 'Final Exam');

    return {
      midExams: midExams.map(es => ({
        examId: es.examId,
        examType: es.examType,
        mark: es.mark,
        exam: es.exam
      })),
      finalExams: finalExams.map(es => ({
        examId: es.examId,
        examType: es.examType,
        mark: es.mark,
        exam: es.exam
      }))
    };
  }

  async getExamsByTeacherAndCourse(teacherId: number, courseId: number) {
    const teacher = await this.teacherRepository.findOne({ where: { userId: teacherId } });
    // Find all exams for the course, but only if the course belongs to the teacher
    const exams = await this.examRepository.find({
      where: { courseId },
      relations: ['course', 'questions', 'video'],
      order: { id: 'DESC' }
    });

    // Filter by teacherId to ensure only exams from courses owned by the teacher
    const teacherExams = exams.filter(exam => exam.course.teacherId === teacher.id);

    if (teacherExams.length === 0) {
      throw new NotFoundException('No exams found for this teacher and course combination');
    }

    return teacherExams;
  }
}