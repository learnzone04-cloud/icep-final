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
var StoryGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let StoryGateway = StoryGateway_1 = class StoryGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(StoryGateway_1.name);
        this.onlineUsers = new Map();
    }
    async handleConnection(socket) {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                this.logger.warn(`Connection attempt without token from ${socket.handshake.address}`);
                socket.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            socket.data.user = payload;
            const userId = payload.id;
            this.onlineUsers.set(userId, { userId, socketId: socket.id });
            this.logger.log(`User ${userId} connected to story gateway (${socket.id})`);
        }
        catch (error) {
            this.logger.error(`Authentication failed: ${error.message}`);
            socket.disconnect();
        }
    }
    async handleDisconnect(socket) {
        const userId = socket.data.user?.id;
        if (userId && this.onlineUsers.has(userId)) {
            this.onlineUsers.delete(userId);
            this.logger.log(`User ${userId} disconnected from story gateway (${socket.id})`);
        }
    }
    emitStoryCreated(story, followerUserIds) {
        this.emitToUsers('storyCreated', story, followerUserIds);
    }
    emitStoryDeleted(storyId, followerUserIds) {
        this.emitToUsers('storyDeleted', { id: storyId }, followerUserIds);
    }
    emitToUsers(event, payload, userIds) {
        userIds.forEach((userId) => {
            const user = this.onlineUsers.get(userId);
            if (user) {
                this.server.to(user.socketId).emit(event, payload);
                this.logger.log(`Emitted ${event} to user ${userId}`);
            }
        });
    }
};
exports.StoryGateway = StoryGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], StoryGateway.prototype, "server", void 0);
exports.StoryGateway = StoryGateway = StoryGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: true,
        namespace: '/story',
        transports: ['websocket', 'polling'],
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], StoryGateway);
//# sourceMappingURL=story.gateway.js.map