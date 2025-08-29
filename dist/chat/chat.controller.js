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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const chat_dto_1 = require("./dto/chat.dto");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async getUserChats(userId) {
        return this.chatService.getUserChats(userId);
    }
    async getChatMessages(chatId) {
        const chat = await this.chatService.findOneById(chatId);
        if (!chat)
            throw new Error('Chat not found');
        return this.chatService.getChatMessages(chat);
    }
    async createChat(body) {
        const chat = await this.chatService.findOrCreateChat(body.studentId, body.teacherId);
        return { chatId: chat.id, chat };
    }
    async getChatByParticipants(studentId, teacherId) {
        const chat = await this.chatService.getChatByParticipants(Number(studentId), Number(teacherId));
        if (!chat)
            return { chatId: null };
        return { chatId: chat.id, chat };
    }
    async sendMessage(body, req) {
        console.log('Controller received body:', body);
        const user = req.user;
        const senderId = user.id;
        const chat = await this.chatService.findOneById(body.chatId);
        if (!chat)
            throw new Error('Chat not found');
        const message = await this.chatService.saveMessage(chat, senderId, body.message);
        return { chat, message };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUserChats", null);
__decorate([
    (0, common_1.Get)(':chatId/messages'),
    __param(0, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatMessages", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.CreateChatDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createChat", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('by-participants'),
    __param(0, (0, common_1.Query)('studentId')),
    __param(1, (0, common_1.Query)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatByParticipants", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('message'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map