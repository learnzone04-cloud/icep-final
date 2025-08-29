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
exports.RateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rate_entity_1 = require("./entities/rate.entity");
const Student_1 = require("../student/entity/Student");
const Teacher_1 = require("../teacher/entity/Teacher");
let RateService = class RateService {
    constructor(rateRepository, studentRepository, teacherRepository) {
        this.rateRepository = rateRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
    }
    async create(createRateDto, studentId) {
        const student = await this.studentRepository.findOne({ where: { userId: studentId } });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const teacher = await this.teacherRepository.findOne({ where: { id: createRateDto.teacherId } });
        if (!teacher) {
            throw new common_1.NotFoundException('Teacher not found');
        }
        const existingRate = await this.rateRepository.findOne({
            where: { studentId: student.id, teacherId: createRateDto.teacherId }
        });
        if (existingRate) {
            throw new common_1.ForbiddenException('You have already rated this teacher');
        }
        const rate = this.rateRepository.create({
            ...createRateDto,
            studentId: student.id,
        });
        return this.rateRepository.save(rate);
    }
    async findAll() {
        return this.rateRepository.find({
            relations: ['student', 'teacher', 'student.user', 'teacher.user']
        });
    }
    async findOne(id) {
        const rate = await this.rateRepository.findOne({
            where: { id },
            relations: ['student', 'teacher', 'student.user', 'teacher.user']
        });
        if (!rate) {
            throw new common_1.NotFoundException('Rate not found');
        }
        return rate;
    }
    async findByTeacherId(teacherId) {
        return this.rateRepository.find({
            where: { teacherId },
            relations: ['student', 'student.user']
        });
    }
    async update(id, updateRateDto, studentId) {
        const rate = await this.findOne(id);
        if (rate.studentId !== studentId) {
            throw new common_1.ForbiddenException('You can only update your own ratings');
        }
        Object.assign(rate, updateRateDto);
        return this.rateRepository.save(rate);
    }
    async remove(id, studentId) {
        const rate = await this.findOne(id);
        if (rate.studentId !== studentId) {
            throw new common_1.ForbiddenException('You can only delete your own ratings');
        }
        await this.rateRepository.remove(rate);
        return { message: 'Rating deleted successfully' };
    }
    async getAverageRatingByTeacherId(teacherId) {
        const result = await this.rateRepository
            .createQueryBuilder('rate')
            .select('AVG(rate.rating)', 'avg')
            .where('rate.teacherId = :teacherId', { teacherId })
            .getRawOne();
        return result && result.avg !== null ? parseFloat(result.avg) : null;
    }
};
exports.RateService = RateService;
exports.RateService = RateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rate_entity_1.Rate)),
    __param(1, (0, typeorm_1.InjectRepository)(Student_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(Teacher_1.TeacherEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RateService);
//# sourceMappingURL=rate.service.js.map