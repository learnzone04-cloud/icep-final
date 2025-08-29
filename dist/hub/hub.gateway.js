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
var HubGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const hub_service_1 = require("./hub.service");
const jwt_1 = require("@nestjs/jwt");
const send_message_dto_1 = require("./dtos/send-message.dto");
const get_history_dto_1 = require("./dtos/get-history.dto");
let HubGateway = HubGateway_1 = class HubGateway {
    constructor(hubService, jwtService) {
        this.hubService = hubService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(HubGateway_1.name);
        this.onlineUsers = new Map();
        this.RATE_LIMIT_MS = 1000;
    }
    afterInit(server) {
        this.logger.log('Hub WebSocket Gateway initialized');
        server.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
                if (!token) {
                    this.logger.warn(`Connection attempt without token from ${socket.handshake.address}`);
                    return next(new Error('Authentication error: No token provided'));
                }
                const payload = this.jwtService.verify(token);
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
    async handleConnection(socket) {
        const userId = socket.data.user?.id || 'unknown';
        this.logger.log(`Client connected: ${socket.id} (User: ${userId})`);
    }
    async handleDisconnect(socket) {
        const userId = socket.data.user?.id || 'unknown';
        this.logger.log(`Client disconnected: ${socket.id} (User: ${userId})`);
        for (const [userId, userData] of this.onlineUsers.entries()) {
            if (userData.socketId === socket.id) {
                this.onlineUsers.delete(userId);
                this.broadcastOnlineUsers();
                this.logger.log(`User ${userId} removed from online users`);
                break;
            }
        }
    }
    handleRegister(socket) {
        const userId = socket.data.user.id;
        this.onlineUsers.set(userId, {
            userId,
            socketId: socket.id,
            lastMessageTime: 0
        });
        this.broadcastOnlineUsers();
        socket.emit('registered', { userId });
        this.logger.log(`User ${userId} registered for hub`);
    }
    async handleMessage(data, socket) {
        try {
            const senderId = socket.data.user.id;
            const userData = this.onlineUsers.get(senderId);
            if (userData) {
                const now = Date.now();
                if (now - userData.lastMessageTime < this.RATE_LIMIT_MS) {
                    this.logger.warn(`Rate limit exceeded for user ${senderId}`);
                    socket.emit('error', { message: 'Rate limit exceeded. Please wait before sending another message.' });
                    return;
                }
                userData.lastMessageTime = now;
            }
            const message = await this.hubService.saveMessage(data.content, senderId, data.typeId);
            const fullName = message.sender ? `${message.sender.fName} ${message.sender.lName}` : null;
            this.server.emit('newMessage', { ...message, fullName });
            this.logger.log(`Message sent by user ${senderId}: ${data.content.substring(0, 50)}...`);
        }
        catch (error) {
            this.logger.error(`Failed to send message: ${error.message}`);
            socket.emit('error', { message: 'Failed to send message' });
        }
    }
    async handleGetHistory(data, socket) {
        try {
            const userId = socket.data.user.id;
            const messages = await this.hubService.getMessages(data.limit, data.beforeId);
            socket.emit('history', messages);
            this.logger.log(`History requested by user ${userId}, returned ${messages.length} messages`);
        }
        catch (error) {
            this.logger.error(`Failed to get message history: ${error.message}`);
            socket.emit('error', { message: 'Failed to get message history' });
        }
    }
    handleGetOnlineUsers(socket) {
        const userId = socket.data.user.id;
        const onlineUserIds = Array.from(this.onlineUsers.keys());
        socket.emit('onlineUsers', onlineUserIds);
        this.logger.log(`Online users requested by user ${userId}, returned ${onlineUserIds.length} users`);
    }
    broadcastOnlineUsers() {
        const onlineUserIds = Array.from(this.onlineUsers.keys());
        this.server.emit('onlineUsers', onlineUserIds);
        this.logger.log(`Broadcasted online users: ${onlineUserIds.length} users`);
    }
};
exports.HubGateway = HubGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], HubGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('register'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], HubGateway.prototype, "handleRegister", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_dto_1.SendMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], HubGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getHistory'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_history_dto_1.GetHistoryDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], HubGateway.prototype, "handleGetHistory", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getOnlineUsers'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], HubGateway.prototype, "handleGetOnlineUsers", null);
exports.HubGateway = HubGateway = HubGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: true,
        namespace: '/hub',
        transports: ['websocket', 'polling']
    }),
    __metadata("design:paramtypes", [hub_service_1.HubService,
        jwt_1.JwtService])
], HubGateway);
//# sourceMappingURL=hub.gateway.js.map