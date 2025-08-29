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
exports.ExamStudentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exam_student_entity_1 = require("./exam-student.entity");
const Student_1 = require("../student/entity/Student");
const exam_entity_1 = require("../exam/entities/exam.entity");
const EnrollCourseStudent_entity_1 = require("../enroll-course-student/entity/EnrollCourseStudent.entity");
const course_video_progress_service_1 = require("../course-video-progress/course-video-progress.service");
let ExamStudentService = class ExamStudentService {
    constructor(examStudentRepo, studentRepo, examRepo, enrollCourseStudentRepo, courseVideoProgressService) {
        this.examStudentRepo = examStudentRepo;
        this.studentRepo = studentRepo;
        this.examRepo = examRepo;
        this.enrollCourseStudentRepo = enrollCourseStudentRepo;
        this.courseVideoProgressService = courseVideoProgressService;
    }
    async setMark(examId, userId, mark) {
        if (mark < 0) {
            return { message: 'Mark cannot be less than 0.' };
        }
        if (mark > 50) {
            return { message: 'Mark cannot be greater than 50.' };
        }
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student)
            throw new Error('Student not found');
        let examStudent = await this.examStudentRepo.findOne({ where: { examId, studentId: student.id } });
        const exam = await this.examRepo.findOne({ where: { id: examId }, relations: ['course'] });
        if (!examStudent) {
            examStudent = this.examStudentRepo.create({ examId, studentId: student.id, mark, courseId: exam.courseId, examType: exam.type });
        }
        else {
            examStudent.mark = mark;
        }
        await this.examStudentRepo.save(examStudent);
        if (exam && (exam.type === 'Mid Exam' || exam.type === 'Final Exam') && (exam.label === 'A' || exam.label === 'B')) {
            const enrollment = await this.enrollCourseStudentRepo.findOne({ where: { studentId: student.id, courseId: exam.courseId } });
            if (enrollment) {
                const currentMark = enrollment.mark || 0;
                enrollment.mark = currentMark + mark;
                if (exam.type === 'Final Exam') {
                    if (exam.course && exam.course.hasPassFailSystem && exam.course.passGrade != null) {
                        enrollment.isPass = enrollment.mark >= exam.course.passGrade;
                        if (!enrollment.isPass && exam.course.hasPassFailSystem) {
                            await this.courseVideoProgressService.lockAllExceptFirst(student.id, exam.courseId);
                            const examStudents = await this.examStudentRepo.find({
                                where: { studentId: student.id, courseId: exam.courseId },
                                relations: ['exam']
                            });
                            const midExamStudent = examStudents.find(es => es.examType === 'Mid Exam');
                            const finalExamStudent = examStudents.find(es => es.examType === 'Final Exam');
                            if (midExamStudent && finalExamStudent) {
                                const currentLabel = midExamStudent.exam.label;
                                await this.examStudentRepo.delete([midExamStudent.id, finalExamStudent.id]);
                                const otherLabel = currentLabel === 'A' ? 'B' : 'A';
                                const otherMidExam = await this.examRepo.findOne({ where: { courseId: exam.courseId, type: exam_entity_1.ExamType.MidExam, label: otherLabel } });
                                const otherFinalExam = await this.examRepo.findOne({ where: { courseId: exam.courseId, type: exam_entity_1.ExamType.FinalExam, label: otherLabel } });
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
                                enrollment.mark = 0;
                                await this.enrollCourseStudentRepo.save(enrollment);
                            }
                        }
                        if (enrollment.isPass && exam.course.hasPassFailSystem) {
                            const studentTypeRepo = this.enrollCourseStudentRepo.manager.getRepository('StudentType');
                            const studentType = await studentTypeRepo.findOne({ where: { studentId: student.id, typeId: exam.course.typeId } });
                            if (studentType && exam.course.level && studentType.level === exam.course.level) {
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
};
exports.ExamStudentService = ExamStudentService;
exports.ExamStudentService = ExamStudentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exam_student_entity_1.ExamStudent)),
    __param(1, (0, typeorm_1.InjectRepository)(Student_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(exam_entity_1.Exam)),
    __param(3, (0, typeorm_1.InjectRepository)(EnrollCourseStudent_entity_1.EnrollCourseStudent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        course_video_progress_service_1.CourseVideoProgressService])
], ExamStudentService);
//# sourceMappingURL=exam-student.service.js.map