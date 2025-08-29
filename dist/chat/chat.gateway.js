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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(chatService, jwtService, configService) {
        this.chatService = chatService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(ChatGateway_1.name);
    }
    afterInit(server) {
        this.logger.log('Chat WebSocket Gateway initialized');
        server.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
                if (!token) {
                    this.logger.warn(`Connection attempt without token from ${socket.handshake.address}`);
                    return next(new Error('Authentication error: No token provided'));
                }
                console.log(`Authenticating user with token: ${token}`);
                const payload = this.jwtService.verify(token, {
                    secret: this.configService.get('JWT_SECRET'),
                });
                console.log(`Authenticated user payload:`, payload);
                socket.data.user = payload;
                this.logger.log(`User ${payload.id} authenticated successfully`);
                next();
            }
            catch (error) {
                this.logger.error(`Authentication failed: ${error.message}`);
                next(new Error('Authentication error: Invalid token'));
            }
        });
    }
    async handleJoin(data, client) {
        client.join(`chat_${data.chatId}`);
    }
    async handleCreateChat(data, client) {
        const user = client.data.user;
        let studentId, teacherId;
        if (user.role === 'Student') {
            studentId = user.studentId;
            teacherId = data.otherId;
        }
        else if (user.role === 'Teacher') {
            teacherId = user.teacherId;
            studentId = data.otherId;
        }
        else {
            throw new Error('User must be a student or teacher');
        }
        const chat = await this.chatService.findOrCreateChat(studentId, teacherId);
        client.join(`chat_${chat.id}`);
        return { chatId: chat.id, chat };
    }
    async handleSendMessage(data, client) {
        const user = client.data.user;
        const chat = await this.chatService.findOneById(data.chatId);
        if (!chat)
            throw new Error('Chat not found');
        const msg = await this.chatService.saveMessage(chat, user.id, data.message);
        this.server.to(`chat_${chat.id}`).emit('new_message', msg);
        client.join(`chat_${chat.id}`);
        return msg;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('create_chat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleCreateChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: '/chat', cors: true }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map