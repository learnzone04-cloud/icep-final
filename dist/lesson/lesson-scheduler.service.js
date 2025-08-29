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
var LessonSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Lesson_1 = require("./entity/Lesson");
let LessonSchedulerService = LessonSchedulerService_1 = class LessonSchedulerService {
    constructor(lessonRepository) {
        this.lessonRepository = lessonRepository;
        this.logger = new common_1.Logger(LessonSchedulerService_1.name);
    }
    async autoCompleteLessons() {
        const now = new Date();
        const lessons = await this.lessonRepository.find({
            where: { status: Lesson_1.LessonStatus.SCHEDULED },
        });
        for (const lesson of lessons) {
            const lessonEnd = new Date(lesson.lessonDate);
            const [endHour, endMinute] = lesson.endTime.split(':').map(Number);
            lessonEnd.setHours(endHour, endMinute, 0, 0);
            if (lessonEnd < now) {
                lesson.status = Lesson_1.LessonStatus.COMPLETED;
                await this.lessonRepository.save(lesson);
                this.logger.log(`Lesson ${lesson.id} marked as COMPLETED.`);
            }
        }
    }
};
exports.LessonSchedulerService = LessonSchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LessonSchedulerService.prototype, "autoCompleteLessons", null);
exports.LessonSchedulerService = LessonSchedulerService = LessonSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Lesson_1.Lesson)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LessonSchedulerService);
//# sourceMappingURL=lesson-scheduler.service.js.map