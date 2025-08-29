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
exports.TeacherService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Teacher_1 = require("./entity/Teacher");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const types_service_1 = require("../types/types.service");
const certificate_entity_1 = require("../certificate/entities/certificate.entity");
const Article_1 = require("../article/entity/Article");
const Reel_1 = require("../reels/entity/Reel");
const course_entity_1 = require("../course/entities/course.entity");
const fs = require("fs");
const path = require("path");
const follower_entity_1 = require("../follower/entities/follower.entity");
const student_service_1 = require("../student/student.service");
const rate_service_1 = require("../rate/rate.service");
let TeacherService = class TeacherService {
    constructor(teacherRepo, certificateRepo, articleRepo, reelRepo, courseRepo, followerRepo, userService, typeService, studentService, rateService) {
        this.teacherRepo = teacherRepo;
        this.certificateRepo = certificateRepo;
        this.articleRepo = articleRepo;
        this.reelRepo = reelRepo;
        this.courseRepo = courseRepo;
        this.followerRepo = followerRepo;
        this.userService = userService;
        this.typeService = typeService;
        this.studentService = studentService;
        this.rateService = rateService;
    }
    async createTeacher(id, cvPath, certificatePaths, data) {
        const user = await this.userService.findOneById(id);
        const type = await this.typeService.findOneById(data.typeId);
        const teacher = this.teacherRepo.create(data);
        teacher.user = user;
        teacher.type = type;
        teacher.cv = cvPath;
        const tt = await this.teacherRepo.save(teacher);
        const certificatePromises = certificatePaths.map(async (path) => {
            const certificate = this.certificateRepo.create({
                teacherId: tt.id,
                certificate: path,
            });
            certificate.teacher = teacher;
            return this.certificateRepo.save(certificate);
        });
        await Promise.all(certificatePromises);
        return tt;
    }
    find() {
        return this.teacherRepo.find();
    }
    async checkFollowStatus(userId, teacherId) {
        console.log('Checking follow status for user:', userId, 'and teacher:', teacherId);
        const studentId = await this.studentService.getStudentIdByUserId(userId);
        console.log('Found student ID:', studentId);
        const follower = await this.followerRepo.findOne({
            where: { studentId, teacherId }
        });
        return !!follower;
    }
    async findByUserType(user) {
        console.log('User from JWT:', user);
        console.log('User role:', user.role);
        console.log('User typeId:', user.typeId);
        if (user.role === 'Student' && user.typeId) {
            console.log('Filtering teachers for student with typeId:', user.typeId);
            const teachers = await this.teacherRepo.find({
                where: { typeId: user.typeId },
                relations: ['user', 'type', 'certificate'],
            });
            const teachersWithFollowStatus = await Promise.all(teachers.map(async (teacher) => {
                const isFollowing = await this.checkFollowStatus(user.id, teacher.id);
                return {
                    ...teacher,
                    isFollowing
                };
            }));
            console.log('Found teachers for student:', teachersWithFollowStatus.map(t => ({
                id: t.id,
                typeId: t.typeId,
                name: `${t.user?.fName} ${t.user?.lName}`,
                isFollowing: t.isFollowing
            })));
            return teachersWithFollowStatus;
        }
        if (user.role === 'Teacher') {
            console.log('Teacher requesting all teachers');
            const teachers = await this.teacherRepo.find({
                relations: ['user', 'type', 'certificate'],
            });
            console.log('Found all teachers:', teachers.map(t => ({
                id: t.id,
                typeId: t.typeId,
                name: `${t.user?.fName} ${t.user?.lName}`
            })));
            return teachers;
        }
        console.log('No valid role found, returning empty array');
        return [];
    }
    async findOneByUserType(user, teacherId) {
        console.log('User requesting specific teacher:', user.id, 'teacherId:', teacherId);
        if (user.role === 'Student' && user.typeId) {
            console.log('Student requesting teacher with typeId:', user.typeId);
            const teacher = await this.teacherRepo.findOne({
                where: {
                    id: teacherId,
                    typeId: user.typeId
                },
                relations: ['user', 'type', 'certificate'],
            });
            if (!teacher) {
                console.log('Teacher not found or type mismatch');
                return null;
            }
            const isFollowing = await this.checkFollowStatus(user.id, teacher.id);
            const averageRating = await this.rateService.getAverageRatingByTeacherId(teacher.id);
            const teacherWithFollowStatus = {
                ...teacher,
                isFollowing,
                averageRating,
            };
            console.log('Found teacher for student:', {
                id: teacher.id,
                typeId: teacher.typeId,
                name: `${teacher.user?.fName} ${teacher.user?.lName}`,
                isFollowing,
                averageRating,
            });
            return teacherWithFollowStatus;
        }
        if (user.role === 'Teacher') {
            console.log('Teacher requesting specific teacher');
            const teacher = await this.teacherRepo.findOne({
                where: { id: teacherId },
                relations: ['user', 'type', 'certificate'],
            });
            const averageRating = teacher ? await this.rateService.getAverageRatingByTeacherId(teacher.id) : null;
            const teacherWithAverage = teacher ? { ...teacher, averageRating } : null;
            console.log('Found teacher:', teacherWithAverage ? {
                id: teacherWithAverage.id,
                typeId: teacherWithAverage.typeId,
                name: `${teacherWithAverage.user?.fName} ${teacherWithAverage.user?.lName}`,
                averageRating,
            } : null);
            return teacherWithAverage;
        }
        console.log('No valid role found, returning null');
        return null;
    }
    findOneByUser(id) {
        return this.teacherRepo.findOne({
            where: { userId: id }
        });
    }
    findOneById(id) {
        return this.teacherRepo.findOne({
            where: { id: id },
            relations: ['user'],
        });
    }
    async delete(id) {
        const findTeacher = await this.findOneById(id);
        if (!findTeacher)
            throw new common_1.NotFoundException('Teacher Not Found');
        return this.teacherRepo.remove(findTeacher);
    }
    async update(id, data) {
        const findTeacher = await this.findOneById(id);
        if (!findTeacher)
            throw new common_1.NotFoundException('Teacher Not Found');
        Object.assign(findTeacher, data);
        return this.teacherRepo.save(findTeacher);
    }
    async updateProfile(userId, data) {
        const findTeacher = await this.findOneByUser(userId);
        if (!findTeacher)
            throw new common_1.NotFoundException('Teacher Not Found');
        console.log('Updating teacher profile:', data);
        if (data.facebookUrl !== undefined)
            findTeacher.facebookUrl = data.facebookUrl;
        if (data.instagramUrl !== undefined)
            findTeacher.instagramUrl = data.instagramUrl;
        if (data.cv !== undefined)
            findTeacher.cv = data.cv;
        if (data.certificates !== undefined) {
            await this.certificateRepo.delete({ teacherId: findTeacher.id });
            if (Array.isArray(data.certificates)) {
                const certificateEntities = data.certificates.map(certPath => {
                    return this.certificateRepo.create({
                        teacherId: findTeacher.id,
                        certificate: certPath,
                    });
                });
                await this.certificateRepo.save(certificateEntities);
            }
        }
        Object.assign(findTeacher, data);
        console.log('Updated teacher profile:', findTeacher);
        return this.teacherRepo.save(findTeacher);
    }
    async updateCV(userId, newCvFilename) {
        const findTeacher = await this.findOneByUser(userId);
        if (!findTeacher)
            throw new common_1.NotFoundException('Teacher Not Found');
        if (findTeacher.cv) {
            const oldCvPath = path.join(process.cwd(), 'uploads', 'teacher', findTeacher.cv);
            try {
                if (fs.existsSync(oldCvPath)) {
                    fs.unlinkSync(oldCvPath);
                }
            }
            catch (error) {
                console.error('Error deleting old CV file:', error);
            }
        }
        findTeacher.cv = newCvFilename;
        return this.teacherRepo.save(findTeacher);
    }
    async getTeacherArticles(userId) {
        const articles = await this.articleRepo.find({
            where: { userId: userId },
            relations: ['user', 'type'],
            order: { createdAt: 'DESC' },
        });
        return articles;
    }
    async getTeacherReels(userId) {
        const reels = await this.reelRepo.find({
            where: { userId: String(userId) },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
        return reels;
    }
    async getTeacherCourses(userId) {
        const teacher = await this.findOneByUser(userId);
        if (!teacher)
            throw new common_1.NotFoundException('Teacher Not Found');
        const courses = await this.courseRepo.find({
            where: { teacherId: Number(teacher.id) },
            relations: ['teacher', 'teacher.user', 'type'],
        });
        return courses;
    }
};
exports.TeacherService = TeacherService;
exports.TeacherService = TeacherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Teacher_1.TeacherEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(certificate_entity_1.CertificateEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(Article_1.ArticleEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(Reel_1.ReelEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(5, (0, typeorm_1.InjectRepository)(follower_entity_1.Follower)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        types_service_1.TypesService,
        student_service_1.StudentService,
        rate_service_1.RateService])
], TeacherService);
//# sourceMappingURL=teacher.service.js.map