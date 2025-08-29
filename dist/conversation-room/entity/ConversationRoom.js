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
exports.ConversationRoom = exports.ConversationRoomStatus = void 0;
const typeorm_1 = require("typeorm");
const Teacher_1 = require("../../teacher/entity/Teacher");
const ConversationRoomParticipant_1 = require("./ConversationRoomParticipant");
const Type_1 = require("../../types/entity/Type");
var ConversationRoomStatus;
(function (ConversationRoomStatus) {
    ConversationRoomStatus["SCHEDULED"] = "scheduled";
    ConversationRoomStatus["ONGOING"] = "ongoing";
    ConversationRoomStatus["COMPLETED"] = "completed";
    ConversationRoomStatus["CANCELLED"] = "cancelled";
})(ConversationRoomStatus || (exports.ConversationRoomStatus = ConversationRoomStatus = {}));
let ConversationRoom = class ConversationRoom {
};
exports.ConversationRoom = ConversationRoom;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ConversationRoom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ConversationRoom.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ConversationRoom.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array' }),
    __metadata("design:type", Array)
], ConversationRoom.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], ConversationRoom.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], ConversationRoom.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'usd' }),
    __metadata("design:type", String)
], ConversationRoom.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ConversationRoom.prototype, "typeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], ConversationRoom.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], ConversationRoom.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 15 }),
    __metadata("design:type", Number)
], ConversationRoom.prototype, "maxStudents", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ConversationRoomStatus, default: ConversationRoomStatus.SCHEDULED }),
    __metadata("design:type", String)
], ConversationRoom.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], ConversationRoom.prototype, "teacherJoinedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Teacher_1.TeacherEntity, teacher => teacher.conversationRooms, { eager: true }),
    __metadata("design:type", Teacher_1.TeacherEntity)
], ConversationRoom.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ConversationRoomParticipant_1.ConversationRoomParticipant, participant => participant.room),
    __metadata("design:type", Array)
], ConversationRoom.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Type_1.TypeEntity, (type) => type.conversationRooms),
    (0, typeorm_1.JoinColumn)({ name: 'typeId' }),
    __metadata("design:type", Type_1.TypeEntity)
], ConversationRoom.prototype, "type", void 0);
exports.ConversationRoom = ConversationRoom = __decorate([
    (0, typeorm_1.Entity)()
], ConversationRoom);
//# sourceMappingURL=ConversationRoom.js.map