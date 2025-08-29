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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubMessage = void 0;
const typeorm_1 = require("typeorm");
const Type_1 = require("../../types/entity/Type");
const User_1 = require("../../users/entity/User");
let HubMessage = class HubMessage {
};
exports.HubMessage = HubMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HubMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], HubMessage.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], HubMessage.prototype, "badword", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.UserEntity, { eager: true, nullable: false }),
    __metadata("design:type", User_1.UserEntity)
], HubMessage.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], HubMessage.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Type_1.TypeEntity, { eager: true, nullable: false }),
    __metadata("design:type", Type_1.TypeEntity)
], HubMessage.prototype, "type", void 0);
exports.HubMessage = HubMessage = __decorate([
    (0, typeorm_1.Entity)()
], HubMessage);
//# sourceMappingURL=hub-message.entity.js.map