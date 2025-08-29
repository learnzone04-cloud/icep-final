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
exports.StoryLike = void 0;
const typeorm_1 = require("typeorm");
const Story_1 = require("./Story");
const Student_1 = require("../../student/entity/Student");
let StoryLike = class StoryLike {
};
exports.StoryLike = StoryLike;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StoryLike.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], StoryLike.prototype, "storyId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], StoryLike.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StoryLike.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Story_1.Story, story => story.likes),
    (0, typeorm_1.JoinColumn)({ name: 'storyId' }),
    __metadata("design:type", Story_1.Story)
], StoryLike.prototype, "story", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Student_1.Student, student => student.storyLikes),
    (0, typeorm_1.JoinColumn)({ name: 'studentId' }),
    __metadata("design:type", Student_1.Student)
], StoryLike.prototype, "student", void 0);
exports.StoryLike = StoryLike = __decorate([
    (0, typeorm_1.Entity)('story_likes')
], StoryLike);
//# sourceMappingURL=StoryLike.js.map