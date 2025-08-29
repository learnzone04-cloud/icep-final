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
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Tag_1 = require("./entities/Tag");
const teacher_service_1 = require("../teacher/teacher.service");
let TagsService = class TagsService {
    constructor(tagRepository, teacherService) {
        this.tagRepository = tagRepository;
        this.teacherService = teacherService;
    }
    async createTag(createTagDto) {
        const tag = this.tagRepository.create(createTagDto);
        return await this.tagRepository.save(tag);
    }
    async getTagsByType(typeId) {
        return await this.tagRepository.find({
            where: { typeId },
            order: { name: 'ASC' },
        });
    }
    async getTagsByTeacherType(userId) {
        const teacher = await this.teacherService.findOneByUser(userId);
        if (!teacher) {
            throw new Error('Teacher not found');
        }
        return await this.tagRepository.find({
            where: { typeId: teacher.typeId },
            order: { name: 'ASC' },
        });
    }
    async getAllTags() {
        return await this.tagRepository.find({
            order: { typeId: 'ASC', name: 'ASC' },
        });
    }
    async getTagsOrderedByType() {
        const allTags = await this.tagRepository.find({
            relations: ['type'],
            order: { typeId: 'ASC', name: 'ASC' },
        });
        const tagsByType = {};
        allTags.forEach(tag => {
            const typeName = tag.type?.name || `Type ${tag.typeId}`;
            if (!tagsByType[typeName]) {
                tagsByType[typeName] = [];
            }
            tagsByType[typeName].push(tag);
        });
        return tagsByType;
    }
    async getTagById(id) {
        return await this.tagRepository.findOne({ where: { id } });
    }
    async updateTag(id, updateTagDto) {
        const { name } = updateTagDto;
        if (name !== undefined) {
            await this.tagRepository.update(id, { name });
        }
        return await this.getTagById(id);
    }
    async deleteTag(id) {
        await this.tagRepository.delete(id);
    }
    async tagExists(name, typeId) {
        const tag = await this.tagRepository.findOne({
            where: { name, typeId },
        });
        return !!tag;
    }
    async getTagsByNames(names, typeId) {
        return await this.tagRepository
            .createQueryBuilder('tag')
            .where('tag.name IN (:...names)', { names })
            .andWhere('tag.typeId = :typeId', { typeId })
            .getMany();
    }
};
exports.TagsService = TagsService;
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Tag_1.Tag)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        teacher_service_1.TeacherService])
], TagsService);
//# sourceMappingURL=tags.service.js.map