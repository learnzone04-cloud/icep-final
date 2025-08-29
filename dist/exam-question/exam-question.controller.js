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
exports.ExamQuestionController = void 0;
const common_1 = require("@nestjs/common");
const exam_question_service_1 = require("./exam-question.service");
const create_exam_question_dto_1 = require("./dto/create-exam-question.dto");
const update_exam_question_dto_1 = require("./dto/update-exam-question.dto");
let ExamQuestionController = class ExamQuestionController {
    constructor(examQuestionService) {
        this.examQuestionService = examQuestionService;
    }
    async create(createExamQuestionDto, examId) {
        return await this.examQuestionService.create(createExamQuestionDto, Number(examId));
    }
    findAll() {
        return this.examQuestionService.findAll();
    }
    findAllByExamId(examId) {
        return this.examQuestionService.findAllByExamId(+examId);
    }
    findOne(id) {
        return this.examQuestionService.findOne(+id);
    }
    update(id, updateExamQuestionDto) {
        return this.examQuestionService.update(+id, updateExamQuestionDto);
    }
    remove(id) {
        return this.examQuestionService.remove(+id);
    }
};
exports.ExamQuestionController = ExamQuestionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('examid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_exam_question_dto_1.CreateExamQuestionDto, String]),
    __metadata("design:returntype", Promise)
], ExamQuestionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExamQuestionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('exam/:examId'),
    __param(0, (0, common_1.Param)('examId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamQuestionController.prototype, "findAllByExamId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamQuestionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_exam_question_dto_1.UpdateExamQuestionDto]),
    __metadata("design:returntype", void 0)
], ExamQuestionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamQuestionController.prototype, "remove", null);
exports.ExamQuestionController = ExamQuestionController = __decorate([
    (0, common_1.Controller)('exam-question'),
    __metadata("design:paramtypes", [exam_question_service_1.ExamQuestionService])
], ExamQuestionController);
//# sourceMappingURL=exam-question.controller.js.map