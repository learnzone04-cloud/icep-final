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
exports.UserEntity = exports.UserRole = void 0;
const class_transformer_1 = require("class-transformer");
const ArticleComment_1 = require("../../article-comment/entity/ArticleComment");
const ArticleLike_1 = require("../../article-like/entity/ArticleLike");
const ArticleReed_1 = require("../../article-reed/entity/ArticleReed");
const Article_1 = require("../../article/entity/Article");
const ReelComment_1 = require("../../reel-comment/entity/ReelComment");
const ReelLike_1 = require("../../reel-like/entity/ReelLike");
const Reel_1 = require("../../reels/entity/Reel");
const ShortVideo_1 = require("../../short-video/entity/ShortVideo");
const ShortVideoLike_1 = require("../../short-video-like/entity/ShortVideoLike");
const ShortVideoComment_1 = require("../../short-video-comment/entity/ShortVideoComment");
const Student_1 = require("../../student/entity/Student");
const Teacher_1 = require("../../teacher/entity/Teacher");
const Notification_1 = require("../../notification/entity/Notification");
const typeorm_1 = require("typeorm");
var UserRole;
(function (UserRole) {
    UserRole["Teacher"] = "Teacher";
    UserRole["Student"] = "Student";
    UserRole["Admin"] = "Admin";
})(UserRole || (exports.UserRole = UserRole = {}));
let UserEntity = class UserEntity {
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "fName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "lName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRole, default: UserRole.Student }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Teacher_1.TeacherEntity, (teacher) => teacher.user, { nullable: true }),
    __metadata("design:type", Teacher_1.TeacherEntity)
], UserEntity.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Student_1.Student, (teacher) => teacher.user, { nullable: true }),
    __metadata("design:type", Student_1.Student)
], UserEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Reel_1.ReelEntity, (reel) => reel.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "reels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ShortVideo_1.ShortVideoEntity, (shortVideo) => shortVideo.teacher),
    __metadata("design:type", Array)
], UserEntity.prototype, "shortVideos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Article_1.ArticleEntity, (article) => article.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "articles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReelLike_1.ReelLikeEntity, (reel) => reel.student),
    __metadata("design:type", Array)
], UserEntity.prototype, "reelLikes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReelComment_1.ReelCommentEntity, (reel) => reel.student),
    __metadata("design:type", Array)
], UserEntity.prototype, "reelComment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ShortVideoLike_1.ShortVideoLikeEntity, (shortVideo) => shortVideo.student),
    __metadata("design:type", Array)
], UserEntity.prototype, "shortVideoLikes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ShortVideoComment_1.ShortVideoCommentEntity, (shortVideo) => shortVideo.student),
    __metadata("design:type", Array)
], UserEntity.prototype, "shortVideoComments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ArticleLike_1.ArticleLike, (article) => article.student),
    __metadata("design:type", Array)
], UserEntity.prototype, "articleLikes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ArticleComment_1.ArticleComment, (article) => article.student),
    __metadata("design:type", Array)
], UserEntity.prototype, "articleComments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ArticleReed_1.ArticleRead, (article) => article.student),
    __metadata("design:type", Array)
], UserEntity.prototype, "articleReads", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Notification_1.Notification, (notification) => notification.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)('users')
], UserEntity);
//# sourceMappingURL=User.js.map