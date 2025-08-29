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
exports.Student = void 0;
const follower_entity_1 = require("../../follower/entities/follower.entity");
const NewWord_1 = require("../../new-word/entity/NewWord");
const StudentType_1 = require("../../student-type/entity/StudentType");
const User_1 = require("../../users/entity/User");
const EnrollCourseStudent_entity_1 = require("../../enroll-course-student/entity/EnrollCourseStudent.entity");
const exam_student_entity_1 = require("../../exam-student/exam-student.entity");
const Note_1 = require("../../notes/entity/Note");
const SavedArticle_1 = require("../../saved-article/entity/SavedArticle");
const ConversationRoomParticipant_1 = require("../../conversation-room/entity/ConversationRoomParticipant");
const StoryLike_1 = require("../../story/entity/StoryLike");
const rate_entity_1 = require("../../rate/entities/rate.entity");
const typeorm_1 = require("typeorm");
let Student = class Student {
};
exports.Student = Student;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Student.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Student.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "work", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => User_1.UserEntity, (user) => user.student),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.UserEntity)
], Student.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => NewWord_1.NewWord, (user) => user.student),
    __metadata("design:type", Array)
], Student.prototype, "words", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => follower_entity_1.Follower, (user) => user.student),
    __metadata("design:type", Array)
], Student.prototype, "followers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StudentType_1.StudentType, (user) => user.student),
    __metadata("design:type", Array)
], Student.prototype, "studentTypes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EnrollCourseStudent_entity_1.EnrollCourseStudent, (enrollment) => enrollment.student),
    __metadata("design:type", Array)
], Student.prototype, "enrollments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exam_student_entity_1.ExamStudent, (examStudent) => examStudent.student),
    __metadata("design:type", Array)
], Student.prototype, "examStudents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Note_1.Note, (note) => note.student),
    __metadata("design:type", Array)
], Student.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SavedArticle_1.SavedArticle, (savedArticle) => savedArticle.student),
    __metadata("design:type", Array)
], Student.prototype, "savedArticles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ConversationRoomParticipant_1.ConversationRoomParticipant, participation => participation.student),
    __metadata("design:type", Array)
], Student.prototype, "conversationRoomParticipations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StoryLike_1.StoryLike, like => like.student),
    __metadata("design:type", Array)
], Student.prototype, "storyLikes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rate_entity_1.Rate, (rate) => rate.student),
    __metadata("design:type", Array)
], Student.prototype, "rates", void 0);
exports.Student = Student = __decorate([
    (0, typeorm_1.Entity)()
], Student);
//# sourceMappingURL=Student.js.map