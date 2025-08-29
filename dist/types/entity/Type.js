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
exports.TypeEntity = void 0;
const Article_1 = require("../../article/entity/Article");
const ConversationRoom_1 = require("../../conversation-room/entity/ConversationRoom");
const course_entity_1 = require("../../course/entities/course.entity");
const Reel_1 = require("../../reels/entity/Reel");
const ShortVideo_1 = require("../../short-video/entity/ShortVideo");
const StudentType_1 = require("../../student-type/entity/StudentType");
const Teacher_1 = require("../../teacher/entity/Teacher");
const Tag_1 = require("../../tags/entities/Tag");
const typeorm_1 = require("typeorm");
let TypeEntity = class TypeEntity {
};
exports.TypeEntity = TypeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TypeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TypeEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Teacher_1.TeacherEntity, (teacher) => teacher.type),
    __metadata("design:type", Array)
], TypeEntity.prototype, "teachers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Reel_1.ReelEntity, (reel) => reel.type),
    __metadata("design:type", Array)
], TypeEntity.prototype, "reels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ShortVideo_1.ShortVideoEntity, (shortVideo) => shortVideo.type),
    __metadata("design:type", Array)
], TypeEntity.prototype, "shortVideos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StudentType_1.StudentType, (reel) => reel.type),
    __metadata("design:type", Array)
], TypeEntity.prototype, "studentTypes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TypeEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => course_entity_1.Course, (type) => type.type),
    __metadata("design:type", course_entity_1.Course)
], TypeEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Article_1.ArticleEntity, (article) => article.type),
    __metadata("design:type", Array)
], TypeEntity.prototype, "articles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ConversationRoom_1.ConversationRoom, (room) => room.type),
    __metadata("design:type", Array)
], TypeEntity.prototype, "conversationRooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Tag_1.Tag, (tag) => tag.type),
    __metadata("design:type", Array)
], TypeEntity.prototype, "tags", void 0);
exports.TypeEntity = TypeEntity = __decorate([
    (0, typeorm_1.Entity)('types')
], TypeEntity);
//# sourceMappingURL=Type.js.map