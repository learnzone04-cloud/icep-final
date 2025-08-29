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
exports.ConversationRoomParticipant = void 0;
const typeorm_1 = require("typeorm");
const ConversationRoom_1 = require("./ConversationRoom");
const Student_1 = require("../../student/entity/Student");
let ConversationRoomParticipant = class ConversationRoomParticipant {
};
exports.ConversationRoomParticipant = ConversationRoomParticipant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ConversationRoomParticipant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ConversationRoom_1.ConversationRoom, room => room.participants),
    __metadata("design:type", ConversationRoom_1.ConversationRoom)
], ConversationRoomParticipant.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Student_1.Student, student => student.conversationRoomParticipations, { eager: true }),
    __metadata("design:type", Student_1.Student)
], ConversationRoomParticipant.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ConversationRoomParticipant.prototype, "paid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], ConversationRoomParticipant.prototype, "joinedAt", void 0);
exports.ConversationRoomParticipant = ConversationRoomParticipant = __decorate([
    (0, typeorm_1.Entity)()
], ConversationRoomParticipant);
//# sourceMappingURL=ConversationRoomParticipant.js.map