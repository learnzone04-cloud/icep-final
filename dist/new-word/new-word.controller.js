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
exports.NewWordController = void 0;
const common_1 = require("@nestjs/common");
const new_word_service_1 = require("./new-word.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_word_dto_1 = require("./dtos/create-word.dto");
const update_word_dto_1 = require("./dtos/update-word.dto");
let NewWordController = class NewWordController {
    constructor(service) {
        this.service = service;
    }
    createWord(req, body) {
        return this.service.createTeacher(req.user.id, body);
    }
    get() {
        return this.service.find();
    }
    update(req, body, id) {
        return this.service.update(id, body);
    }
    delete(id) {
        return this.service.delete(id);
    }
};
exports.NewWordController = NewWordController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_word_dto_1.CreateNewWordDto]),
    __metadata("design:returntype", void 0)
], NewWordController.prototype, "createWord", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewWordController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_word_dto_1.UpdateNewWordDto, Number]),
    __metadata("design:returntype", void 0)
], NewWordController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NewWordController.prototype, "delete", null);
exports.NewWordController = NewWordController = __decorate([
    (0, common_1.Controller)('new-word'),
    __metadata("design:paramtypes", [new_word_service_1.NewWordService])
], NewWordController);
//# sourceMappingURL=new-word.controller.js.map