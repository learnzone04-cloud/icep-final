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
exports.ExamService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exam_entity_1 = require("./entities/exam.entity");
const course_service_1 = require("../course/course.service");
const course_video_entity_1 = require("../course-video/entity/course-video.entity");
const exam_question_entity_1 = require("../exam-question/entities/exam-question.entity");
const exam_student_entity_1 = require("../exam-student/exam-student.entity");
const Student_1 = require("../student/entity/Student");
const Teacher_1 = require("../teacher/entity/Teacher");
const typeorm_3 = require("typeorm");
let ExamService = class ExamService {
    constructor(examRepository, courseService, videoRepository, examQuestionRepository, examStudentRepository, studentRepository, teacherRepository, dataSource) {
        this.examRepository = examRepository;
        this.courseService = courseService;
        this.videoRepository = videoRepository;
        this.examQuestionRepository = examQuestionRepository;
        this.examStudentRepository = examStudentRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.dataSource = dataSource;
    }
    async create(createExamDto) {
        const courseExists = await this.courseService.findOne(createExamDto.courseId);
        if (!courseExists) {
            throw new Error('Course not found');
        }
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
        if (createExamDto.videoId) {
            const video = await this.videoRepository.findOne({
                where: { id: Number(createExamDto.videoId), courseId: Number(createExamDto.courseId) },
            });
            if (!video) {
                throw new Error('Video not found or does not belong to the specified course');
            }
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
        const exam = this.examRepository.create({ ...createExamDto, label });
        if (createExamDto.videoId) {
            exam.video = await this.videoRepository.findOne({ where: { id: Number(createExamDto.videoId) } });
        }
        const savedExam = await this.examRepository.save(exam);
        courseExists.examCount = (courseExists.examCount || 0) + 1;
        await this.courseService.update(courseExists.id, { examCount: courseExists.examCount });
        return savedExam;
    }
    async update(id, updateExamDto) {
        const exam = await this.examRepository.findOne({ where: { id } });
        if (!exam)
            throw new Error('Exam not found');
        Object.assign(exam, updateExamDto);
        return this.examRepository.save(exam);
    }
    async remove(id) {
        const exam = await this.examRepository.findOne({ where: { id } });
        if (!exam)
            throw new Error('Exam not found');
        await this.dataSource.transaction(async (manager) => {
            await manager.delete(exam_question_entity_1.ExamQuestion, { exam: { id } });
            await manager.delete(exam_entity_1.Exam, { id });
        });
        return { message: 'Exam and related ExamQuestions deleted successfully' };
    }
    async getSpecificVideoExam(videoId, courseId) {
        const exam = await this.examRepository.findOne({
            where: {
                type: exam_entity_1.ExamType.SpecificVideoExam,
                courseId: courseId,
                video: { id: videoId }
            },
            relations: ['video', 'questions'],
        });
        if (!exam) {
            throw new common_1.NotFoundException('Specific video exam not found');
        }
        return exam;
    }
    async getStudentMidFinalExams(userId, courseId) {
        const student = await this.studentRepository.findOne({ where: { userId } });
        if (!student) {
            throw new common_1.BadRequestException('Student not found');
        }
        console.log('Student found:', student);
        console.log('Course ID:', courseId);
        const examStudents = await this.examStudentRepository.find({
            where: {
                studentId: student.id,
                courseId: courseId,
                examType: (0, typeorm_3.In)(['Mid Exam', 'Final Exam'])
            },
            relations: ['exam', 'exam.questions'],
        });
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
    async getExamsByTeacherAndCourse(teacherId, courseId) {
        const teacher = await this.teacherRepository.findOne({ where: { userId: teacherId } });
        const exams = await this.examRepository.find({
            where: { courseId },
            relations: ['course', 'questions', 'video'],
            order: { id: 'DESC' }
        });
        const teacherExams = exams.filter(exam => exam.course.teacherId === teacher.id);
        if (teacherExams.length === 0) {
            throw new common_1.NotFoundException('No exams found for this teacher and course combination');
        }
        return teacherExams;
    }
};
exports.ExamService = ExamService;
exports.ExamService = ExamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exam_entity_1.Exam)),
    __param(2, (0, typeorm_1.InjectRepository)(course_video_entity_1.CourseVideoEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(exam_question_entity_1.ExamQuestion)),
    __param(4, (0, typeorm_1.InjectRepository)(exam_student_entity_1.ExamStudent)),
    __param(5, (0, typeorm_1.InjectRepository)(Student_1.Student)),
    __param(6, (0, typeorm_1.InjectRepository)(Teacher_1.TeacherEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        course_service_1.CourseService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ExamService);
//# sourceMappingURL=exam.service.js.map