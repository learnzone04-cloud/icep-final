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
var TagsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsController = void 0;
const common_1 = require("@nestjs/common");
const tags_service_1 = require("./tags.service");
const create_tag_dto_1 = require("./dtos/create-tag.dto");
const update_tag_dto_1 = require("./dtos/update-tag.dto");
const admin_auth_guard_1 = require("../admin-auth/admin-auth.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TagsController = TagsController_1 = class TagsController {
    constructor(tagsService) {
        this.tagsService = tagsService;
        this.logger = new common_1.Logger(TagsController_1.name);
    }
    async createTag(createTagDto) {
        this.logger.log(`Creating tag: ${createTagDto.name} for type: ${createTagDto.typeId}`);
        const exists = await this.tagsService.tagExists(createTagDto.name, createTagDto.typeId);
        if (exists) {
            throw new Error(`Tag '${createTagDto.name}' already exists for this type`);
        }
        const tag = await this.tagsService.createTag(createTagDto);
        this.logger.log(`Tag created successfully: ${tag.name}`);
        return {
            success: true,
            message: 'Tag created successfully',
            tag,
        };
    }
    async getAllTags() {
        this.logger.log('Admin requesting all tags');
        const tagsByType = await this.tagsService.getTagsOrderedByType();
        return {
            success: true,
            tagsByType,
            totalCount: Object.values(tagsByType).reduce((acc, tags) => acc + tags.length, 0),
        };
    }
    async getTagsByType(req) {
        if (req.user.role !== 'Teacher') {
            throw new Error('Only teachers can access this endpoint');
        }
        const userId = req.user.id;
        if (!userId) {
            throw new Error('User ID not found in token');
        }
        this.logger.log(`Getting tags for teacher user ID: ${userId}`);
        const tags = await this.tagsService.getTagsByTeacherType(userId);
        return {
            success: true,
            tags,
            totalCount: tags.length,
            userId: userId,
        };
    }
    async getTagById(id) {
        const tagId = parseInt(id);
        const tag = await this.tagsService.getTagById(tagId);
        if (!tag) {
            throw new Error(`Tag with ID ${tagId} not found`);
        }
        return {
            success: true,
            tag,
        };
    }
    async updateTag(id, updateTagDto) {
        const tagId = parseInt(id);
        this.logger.log(`Updating tag ID: ${tagId}`);
        const tag = await this.tagsService.updateTag(tagId, updateTagDto);
        return {
            success: true,
            message: 'Tag updated successfully',
            tag,
        };
    }
    async deleteTag(id) {
        const tagId = parseInt(id);
        this.logger.log(`Deleting tag ID: ${tagId}`);
        await this.tagsService.deleteTag(tagId);
        return {
            success: true,
            message: 'Tag deleted successfully',
        };
    }
    async healthCheck() {
        return {
            status: 'healthy',
            timestamp: new Date(),
            message: 'Tags service is running',
        };
    }
};
exports.TagsController = TagsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tag_dto_1.CreateTagDto]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "createTag", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "getAllTags", null);
__decorate([
    (0, common_1.Get)('type'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "getTagsByType", null);
__decorate([
    (0, common_1.Get)('admin/:id'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "getTagById", null);
__decorate([
    (0, common_1.Put)('admin/:id'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tag_dto_1.UpdateTagDto]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "updateTag", null);
__decorate([
    (0, common_1.Delete)('admin/:id'),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "deleteTag", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "healthCheck", null);
exports.TagsController = TagsController = TagsController_1 = __decorate([
    (0, common_1.Controller)('tags'),
    __metadata("design:paramtypes", [tags_service_1.TagsService])
], TagsController);
//# sourceMappingURL=tags.controller.js.map