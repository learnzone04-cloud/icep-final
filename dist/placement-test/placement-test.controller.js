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
exports.PlacementTestController = void 0;
const common_1 = require("@nestjs/common");
const placement_test_service_1 = require("./placement-test.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PlacementTestController = class PlacementTestController {
    constructor(placementTestService) {
        this.placementTestService = placementTestService;
    }
    async generateQuestions(typeId) {
        return this.placementTestService.generateQuestions(typeId);
    }
    async submitAnswers(req, answers, test, typeId) {
        const studentId = req.user?.studentId;
        return this.placementTestService.evaluateAnswers(studentId, answers, test, typeId);
    }
};
exports.PlacementTestController = PlacementTestController;
__decorate([
    (0, common_1.Post)('generate-questions'),
    __param(0, (0, common_1.Body)('typeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlacementTestController.prototype, "generateQuestions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('submit-answers'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('answers')),
    __param(2, (0, common_1.Body)('test')),
    __param(3, (0, common_1.Body)('typeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Number]),
    __metadata("design:returntype", Promise)
], PlacementTestController.prototype, "submitAnswers", null);
exports.PlacementTestController = PlacementTestController = __decorate([
    (0, common_1.Controller)('placement-test'),
    __metadata("design:paramtypes", [placement_test_service_1.PlacementTestService])
], PlacementTestController);
//# sourceMappingURL=placement-test.controller.js.map