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
exports.TypesController = void 0;
const common_1 = require("@nestjs/common");
const types_service_1 = require("./types.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_auth_guard_1 = require("../admin-auth/admin-auth.guard");
const create_type_dto_1 = require("./dtos/create-type.dto");
const update_type_dto_1 = require("./dtos/update-type.dto");
let TypesController = class TypesController {
    constructor(typeService) {
        this.typeService = typeService;
    }
    createType(req, body) {
        return this.typeService.create(body);
    }
    get() {
        return this.typeService.find();
    }
    deleteType(id) {
        return this.typeService.delete(id);
    }
    updateType(id, body) {
        return this.typeService.update(id, body);
    }
};
exports.TypesController = TypesController;
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_type_dto_1.CreateTypeDto]),
    __metadata("design:returntype", Object)
], TypesController.prototype, "createType", null);
__decorate([
    (0, common_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], TypesController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], TypesController.prototype, "deleteType", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_type_dto_1.UpdateTypeDto]),
    __metadata("design:returntype", Object)
], TypesController.prototype, "updateType", null);
exports.TypesController = TypesController = __decorate([
    (0, common_1.Controller)('types'),
    __metadata("design:paramtypes", [types_service_1.TypesService])
], TypesController);
//# sourceMappingURL=types.controller.js.map