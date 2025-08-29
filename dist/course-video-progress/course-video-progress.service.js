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
exports.CourseVideoProgressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const CourseVideoProgress_entity_1 = require("./entity/CourseVideoProgress.entity");
const Student_1 = require("../student/entity/Student");
const course_entity_1 = require("../course/entities/course.entity");
const course_video_entity_1 = require("../course-video/entity/course-video.entity");
let CourseVideoProgressService = class CourseVideoProgressService {
    constructor(progressRepo, studentRepo, courseRepo, videoRepo) {
        this.progressRepo = progressRepo;
        this.studentRepo = studentRepo;
        this.courseRepo = courseRepo;
        this.videoRepo = videoRepo;
    }
    async initializeProgress(userId, courseId) {
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student)
            throw new Error('Student not found');
        const videos = await this.videoRepo.find({ where: { courseId }, order: { number: 'ASC' } });
        if (!videos.length)
            return;
        const progressRows = videos.map((video, idx) => this.progressRepo.create({
            studentId: student.id,
            courseId,
            videoId: video.id,
            videoNumber: video.number,
            isUnlocked: idx === 0,
            isWatched: false,
        }));
        await this.progressRepo.save(progressRows);
    }
    async unlockNext(userId, courseId, videoId) {
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student)
            throw new Error('Student not found');
        const current = await this.progressRepo.findOne({ where: { studentId: student.id, courseId, videoId } });
        if (!current)
            return { message: 'Progress not found' };
        current.isWatched = true;
        await this.progressRepo.save(current);
        const next = await this.progressRepo.findOne({
            where: {
                studentId: student.id,
                courseId,
                videoNumber: current.videoNumber + 1,
            },
        });
        if (next) {
            next.isUnlocked = true;
            await this.progressRepo.save(next);
        }
        return { message: 'Next video unlocked (if any)' };
    }
    async getProgress(userId, courseId) {
        const student = await this.studentRepo.findOne({ where: { userId } });
        if (!student)
            throw new Error('Student not found');
        return this.progressRepo.find({ where: { studentId: student.id, courseId }, order: { videoNumber: 'ASC' } });
    }
    async lockAllExceptFirst(studentId, courseId) {
        const progresses = await this.progressRepo.find({ where: { studentId, courseId }, order: { videoNumber: 'ASC' } });
        if (!progresses.length)
            return;
        for (let i = 0; i < progresses.length; i++) {
            progresses[i].isUnlocked = i === 0;
        }
        await this.progressRepo.save(progresses);
    }
};
exports.CourseVideoProgressService = CourseVideoProgressService;
exports.CourseVideoProgressService = CourseVideoProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(CourseVideoProgress_entity_1.CourseVideoProgress)),
    __param(1, (0, typeorm_1.InjectRepository)(Student_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(3, (0, typeorm_1.InjectRepository)(course_video_entity_1.CourseVideoEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CourseVideoProgressService);
//# sourceMappingURL=course-video-progress.service.js.map