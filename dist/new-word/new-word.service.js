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
exports.NewWordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const NewWord_1 = require("./entity/NewWord");
const typeorm_2 = require("typeorm");
const student_service_1 = require("../student/student.service");
let NewWordService = class NewWordService {
    constructor(repo, service) {
        this.repo = repo;
        this.service = service;
    }
    async createTeacher(id, data) {
        const user = await this.service.findOneByUserId(id);
        const teacher = this.repo.create(data);
        teacher.student = user;
        return this.repo.save(teacher);
    }
    find() {
        return this.repo.find();
    }
    findOneById(id) {
        return this.repo.findOne({
            where: { id: id },
            relations: ['student'],
        });
    }
    async delete(id) {
        const findTeacher = await this.findOneById(id);
        if (!findTeacher)
            throw new common_1.NotFoundException('Teacher Not Found');
        return this.repo.remove(findTeacher);
    }
    async update(id, data) {
        const findTeacher = await this.findOneById(id);
        if (!findTeacher)
            throw new common_1.NotFoundException('Teacher Not Found');
        Object.assign(findTeacher, data);
        return this.repo.save(findTeacher);
    }
};
exports.NewWordService = NewWordService;
exports.NewWordService = NewWordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(NewWord_1.NewWord)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        student_service_1.StudentService])
], NewWordService);
//# sourceMappingURL=new-word.service.js.map