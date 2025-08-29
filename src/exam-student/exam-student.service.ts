import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamStudent } from './exam-student.entity';
import { Student } from '../student/entity/Student';
import { Exam, ExamType } from '../exam/entities/exam.entity';
import { EnrollCourseStudent } from '../enroll-course-student/entity/EnrollCourseStudent.entity';
import { CourseVideoProgressService } from '../course-video-progress/course-video-progress.service';

@Injectable()
export class ExamStudentService {
  constructor(
    @InjectRepository(ExamStudent)
    private readonly examStudentRepo: Repository<ExamStudent>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Exam)
    private readonly examRepo: Repository<Exam>,
    @InjectRepository(EnrollCourseStudent)
    private readonly enrollCourseStudentRepo: Repository<EnrollCourseStudent>,
    private readonly courseVideoProgressService: CourseVideoProgressService,
  ) {}

  async setMark(examId: number, userId: number, mark: number) {
    if (mark < 0) {
      return { message: 'Mark cannot be less than 0.' };
    }
    if (mark > 50) {
      return { message: 'Mark cannot be greater than 50.' };
    }
    const student = await this.studentRepo.findOne({ where: { userId } });
    if (!student) throw new Error('Student not found');
    let examStudent = await this.examStudentRepo.findOne({ where: { examId, studentId: student.id } });
    const exam = await this.examRepo.findOne({ where: { id: examId }, relations: ['course'] });
    if (!examStudent) {
      examStudent = this.examStudentRepo.create({ examId, studentId: student.id, mark, courseId: exam.courseId, examType: exam.type });
    } else {
      examStudent.mark = mark;
    }
    await this.examStudentRepo.save(examStudent);

    // Update EnrollCourseStudent mark and isPass for A or B mid and final exams
    if (exam && (exam.type === 'Mid Exam' || exam.type === 'Final Exam') && (exam.label === 'A' || exam.label === 'B')) {
      const enrollment = await this.enrollCourseStudentRepo.findOne({ where: { studentId: student.id, courseId: exam.courseId } });
      if (enrollment) {
        // Add the mark to the enrollment's mark (if null, treat as 0)
        const currentMark = enrollment.mark || 0;
        enrollment.mark = currentMark + mark;
        if (exam.type === 'Final Exam') {
          // Only for final exam, check pass/fail
          if (exam.course && exam.course.hasPassFailSystem && exam.course.passGrade != null) {
            enrollment.isPass = enrollment.mark >= exam.course.passGrade;
            if (!enrollment.isPass && exam.course.hasPassFailSystem) {
              // Lock all videos except the first for this student and course
              await this.courseVideoProgressService.lockAllExceptFirst(student.id, exam.courseId);

              // Check and swap exam attempts (A <-> B)
              // 1. Find current ExamStudent records for this student, course, and type mid/final
              const examStudents = await this.examStudentRepo.find({
                where: { studentId: student.id, courseId: exam.courseId },
                relations: ['exam']
              });
              const midExamStudent = examStudents.find(es => es.examType === 'Mid Exam');
              const finalExamStudent = examStudents.find(es => es.examType === 'Final Exam');
              if (midExamStudent && finalExamStudent) {
                const currentLabel = midExamStudent.exam.label;
                // 2. Delete current ExamStudent records
                await this.examStudentRepo.delete([midExamStudent.id, finalExamStudent.id]);
                // 3. Find the other set of exams (label A or B)
                const otherLabel = currentLabel === 'A' ? 'B' : 'A';
                const otherMidExam = await this.examRepo.findOne({ where: { courseId: exam.courseId, type: ExamType.MidExam, label: otherLabel } });
                const otherFinalExam = await this.examRepo.findOne({ where: { courseId: exam.courseId, type: ExamType.FinalExam, label: otherLabel } });
                // 4. Create new ExamStudent records for the other set if they exist
                if (otherMidExam) {
                  await this.examStudentRepo.save(this.examStudentRepo.create({
                    examId: otherMidExam.id,
                    studentId: student.id,
                    courseId: exam.courseId,
                    examType: 'Mid Exam',
                    mark: null,
                  }));
                }
                if (otherFinalExam) {
                  await this.examStudentRepo.save(this.examStudentRepo.create({
                    examId: otherFinalExam.id,
                    studentId: student.id,
                    courseId: exam.courseId,
                    examType: 'Final Exam',
                    mark: null,
                  }));
                }
                // 5. Reset enrollment mark to 0
                enrollment.mark = 0;
                await this.enrollCourseStudentRepo.save(enrollment);
              }
            }
            // If student passed, check and possibly upgrade their level
            if (enrollment.isPass && exam.course.hasPassFailSystem) {
              // Find the student's StudentType for this course's type
              const studentTypeRepo = this.enrollCourseStudentRepo.manager.getRepository('StudentType');
              const studentType = await studentTypeRepo.findOne({ where: { studentId: student.id, typeId: exam.course.typeId } });
              if (studentType && exam.course.level && studentType.level === exam.course.level) {
                // Get PlacementLevel enum order
                const levels = Object.values(require('../placement-test/placement-test.entity').PlacementLevel);
                const currentIdx = levels.indexOf(studentType.level);
                if (currentIdx !== -1 && currentIdx + 1 < levels.length) {
                  studentType.level = levels[currentIdx + 1];
                  await studentTypeRepo.save(studentType);
                }
              }
            }
          }
        }
        await this.enrollCourseStudentRepo.save(enrollment);
      }
    }

    return { message: 'Mark set successfully', examStudent };
  }
} 