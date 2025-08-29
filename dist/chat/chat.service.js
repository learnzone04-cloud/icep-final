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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_entity_1 = require("./entities/chat.entity");
const chat_message_entity_1 = require("./entities/chat-message.entity");
const Student_1 = require("../student/entity/Student");
const Teacher_1 = require("../teacher/entity/Teacher");
let ChatService = class ChatService {
    constructor(chatRepo, messageRepo, studentRepo, teacherRepo) {
        this.chatRepo = chatRepo;
        this.messageRepo = messageRepo;
        this.studentRepo = studentRepo;
        this.teacherRepo = teacherRepo;
    }
    async findOrCreateChat(studentId, teacherId) {
        const student = await this.studentRepo.findOne({ where: { id: studentId } });
        const teacher = await this.teacherRepo.findOne({ where: { id: teacherId } });
        if (!student || !teacher)
            throw new Error('Student or Teacher not found');
        let chat = await this.chatRepo.findOne({ where: { student: { id: studentId }, teacher: { id: teacherId } } });
        if (!chat) {
            chat = this.chatRepo.create({ student, teacher });
            await this.chatRepo.save(chat);
        }
        return chat;
    }
    async saveMessage(chat, senderId, message) {
        const msg = this.messageRepo.create({ chat, senderId, message });
        console.log('Saving message:', msg);
        return this.messageRepo.save(msg);
    }
    async getChatMessages(chat) {
        console.log('Looking for messages for chat:', chat);
        const messages = await this.messageRepo.find({ where: { chat: { id: chat.id } }, order: { createdAt: 'ASC' } });
        console.log('Messages:', messages);
        return messages;
    }
    async getUserChats(userId) {
        const student = await this.studentRepo.findOne({ where: { userId } });
        const teacher = await this.teacherRepo.findOne({ where: { userId } });
        const where = [];
        if (student)
            where.push({ student: { id: student.id } });
        if (teacher)
            where.push({ teacher: { id: teacher.id } });
        if (where.length === 0)
            return [];
        return this.chatRepo.find({ where, order: { updatedAt: 'DESC' }, relations: ['student', 'student.user', 'teacher', 'teacher.user',] });
    }
    async getChatById(chatId) {
        return this.chatRepo.findOne({ where: { id: chatId } });
    }
    async getChatByParticipants(studentId, teacherId) {
        return this.chatRepo.findOne({ where: { student: { id: studentId }, teacher: { id: teacherId } } });
    }
    async findOneById(id) {
        return this.chatRepo.findOne({
            where: { id },
            relations: ['student', 'teacher'],
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(Student_1.Student)),
    __param(3, (0, typeorm_1.InjectRepository)(Teacher_1.TeacherEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map