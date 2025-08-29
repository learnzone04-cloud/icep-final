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
exports.FollowerService = void 0;
const common_1 = require("@nestjs/common");
const follower_entity_1 = require("./entities/follower.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const student_service_1 = require("../student/student.service");
const teacher_service_1 = require("../teacher/teacher.service");
let FollowerService = class FollowerService {
    constructor(repo, studentService, teacherService) {
        this.repo = repo;
        this.studentService = studentService;
        this.teacherService = teacherService;
    }
    async create(id, teacherId) {
        const student = await this.studentService.findOneByUserId(id);
        const teacher = await this.teacherService.findOneById(teacherId);
        const follower = this.repo.create();
        follower.student = student;
        follower.teacher = teacher;
        return this.repo.save(follower);
    }
    find() {
        return this.repo.find();
    }
    async findByUserType(user) {
        console.log('User from JWT:', user);
        console.log('User role:', user.role);
        console.log('User typeId:', user.typeId);
        if (user.role === 'Student' && user.typeId) {
            console.log('Filtering followers for student with typeId:', user.typeId);
            const followers = await this.repo.find({
                where: { studentId: user.id },
                relations: [
                    'teacher',
                    'teacher.type',
                    'student',
                ],
            });
            const filteredFollowers = followers.filter(follower => follower.teacher?.type?.id === user.typeId);
            console.log('Found followers for student:', filteredFollowers.map(f => ({
                id: f.id,
                teacherId: f.teacherId,
                teacherType: f.teacher?.type?.name
            })));
            return filteredFollowers;
        }
        if (user.role === 'Teacher') {
            console.log('Teacher requested followers - returning empty array');
            return [];
        }
        console.log('No valid role found, returning empty array');
        return [];
    }
    async findFollowersForTeacher(user, teacherId) {
        console.log('User from JWT:', user);
        console.log('Requested teacherId:', teacherId);
        if (user.role !== 'Teacher') {
            console.log('Non-teacher user requested followers - returning empty array');
            return [];
        }
        const teacher = await this.teacherService.findOneByUser(user.id);
        if (!teacher || teacher.id !== teacherId) {
            console.log('Teacher trying to access other teacher followers - returning empty array');
            return [];
        }
        console.log('Teacher accessing their own followers');
        const followers = await this.repo.find({
            where: { teacherId: teacherId },
            relations: [
                'student',
                'student.user',
            ],
        });
        console.log('Found followers for teacher:', followers.map(f => ({
            id: f.id,
            studentId: f.studentId,
            studentName: `${f.student?.user?.fName} ${f.student?.user?.lName}`
        })));
        return followers;
    }
    async findMyFollowers(user) {
        console.log('User from JWT:', user);
        if (user.role !== 'Teacher') {
            console.log('Non-teacher user requested followers - returning empty array');
            return [];
        }
        const teacher = await this.teacherService.findOneByUser(user.id);
        if (!teacher) {
            console.log('Teacher record not found - returning empty array');
            return [];
        }
        console.log('Teacher accessing their own followers, teacherId:', teacher.id);
        const followers = await this.repo.find({
            where: { teacherId: teacher.id },
            relations: [
                'student',
                'student.user',
            ],
        });
        console.log('Found followers for teacher:', followers.map(f => ({
            id: f.id,
            studentId: f.studentId,
            studentName: `${f.student?.user?.fName} ${f.student?.user?.lName}`
        })));
        return followers;
    }
    findById(id) {
        return this.repo.findOne({ where: { id: id } });
    }
    async delete(id) {
        const follow = await this.findById(id);
        if (!follow)
            throw new Error('Follow does not found');
        return this.repo.remove(follow);
    }
    async unfollowTeacher(user, teacherId) {
        console.log('User unfollowing teacher:', user.id, 'teacherId:', teacherId);
        console.log('User ID type:', typeof user.id, 'Teacher ID type:', typeof teacherId);
        if (user.role !== 'Student') {
            throw new Error('Only students can unfollow teachers');
        }
        const student = await this.studentService.findOneByUserId(user.id);
        if (!student) {
            throw new Error('Student record not found');
        }
        console.log('Found student record:', student.id);
        const allFollows = await this.repo.find({
            where: { studentId: student.id }
        });
        console.log('All follows for this student:', allFollows);
        const follow = await this.repo.findOne({
            where: {
                studentId: student.id,
                teacherId: teacherId
            }
        });
        console.log('Found follow relationship:', follow);
        if (!follow) {
            throw new Error('Follow relationship not found');
        }
        console.log('Removing follow relationship:', follow.id);
        return this.repo.remove(follow);
    }
    async removeFollower(user, studentId) {
        console.log('Teacher removing follower:', user.id, 'studentId:', studentId);
        if (user.role !== 'Teacher') {
            throw new Error('Only teachers can remove followers');
        }
        const teacher = await this.teacherService.findOneByUser(user.id);
        if (!teacher) {
            throw new Error('Teacher record not found');
        }
        const follow = await this.repo.findOne({
            where: {
                teacherId: teacher.id,
                studentId: studentId
            }
        });
        if (!follow) {
            throw new Error('Follow relationship not found');
        }
        console.log('Removing follow relationship:', follow.id);
        return this.repo.remove(follow);
    }
    async getFollowerUserIdsForTeacher(teacherId) {
        const followers = await this.repo.find({
            where: { teacherId },
            relations: ['student', 'student.user'],
        });
        return followers
            .map(f => f.student?.user?.id)
            .filter(id => typeof id === 'number');
    }
    async toggleFollow(userId, teacherId) {
        console.log('Toggling follow for user:', userId, 'teacherId:', teacherId);
        const student = await this.studentService.findOneByUserId(userId);
        if (!student) {
            throw new Error('Student record not found');
        }
        console.log('Found student record:', student.id);
        const existingFollow = await this.repo.findOne({
            where: {
                studentId: student.id,
                teacherId: teacherId
            }
        });
        if (existingFollow) {
            console.log('Student already following, removing follow relationship');
            await this.repo.remove(existingFollow);
            return {
                message: 'Unfollowed successfully',
                isFollowing: false,
                action: 'unfollowed'
            };
        }
        else {
            console.log('Student not following, creating follow relationship');
            const teacher = await this.teacherService.findOneById(teacherId);
            if (!teacher) {
                throw new Error('Teacher not found');
            }
            const newFollow = this.repo.create({
                studentId: student.id,
                teacherId: teacherId
            });
            await this.repo.save(newFollow);
            return {
                message: 'Followed successfully',
                isFollowing: true,
                action: 'followed'
            };
        }
    }
};
exports.FollowerService = FollowerService;
exports.FollowerService = FollowerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(follower_entity_1.Follower)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        student_service_1.StudentService,
        teacher_service_1.TeacherService])
], FollowerService);
//# sourceMappingURL=follower.service.js.map