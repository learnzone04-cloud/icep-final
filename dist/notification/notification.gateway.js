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
var NotificationGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let NotificationGateway = NotificationGateway_1 = class NotificationGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(NotificationGateway_1.name);
        this.connectedUsers = new Map();
    }
    afterInit(server) {
        this.logger.log('Notification WebSocket Gateway initialized');
        server.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
                if (!token) {
                    this.logger.warn(`Notification connection attempt without token from ${socket.handshake.address}`);
                    return next(new Error('Authentication error: No token provided'));
                }
                const payload = this.jwtService.verify(token);
                socket.data.user = payload;
                this.logger.log(`User ${payload.id} authenticated for notifications`);
                next();
            }
            catch (error) {
                this.logger.error(`Notification authentication failed: ${error.message}`);
                next(new Error('Authentication error: Invalid token'));
            }
        });
    }
    async handleConnection(socket) {
        const user = socket.data.user;
        if (user?.id) {
            this.connectedUsers.set(user.id, {
                userId: user.id,
                socketId: socket.id,
                role: user.role,
                studentId: user.studentId,
                teacherId: user.teacherId
            });
            this.logger.log(`User ${user.id} (${user.role}) connected to notifications`);
        }
    }
    async handleDisconnect(socket) {
        const user = socket.data.user;
        if (user?.id) {
            this.connectedUsers.delete(user.id);
            this.logger.log(`User ${user.id} disconnected from notifications`);
        }
    }
    handleSubscribe(socket) {
        const user = socket.data.user;
        socket.emit('subscribed', {
            userId: user.id,
            role: user.role,
            studentId: user.studentId,
            teacherId: user.teacherId
        });
        this.logger.log(`User ${user.id} (${user.role}) subscribed to notifications`);
    }
    async handleGetUnreadCount(socket) {
        const user = socket.data.user;
        socket.emit('unreadCount', { count: 0 });
    }
    sendNotificationToUser(userId, notification) {
        const user = this.connectedUsers.get(userId);
        if (user) {
            this.server.to(user.socketId).emit('newNotification', {
                id: notification.id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                data: notification.data,
                createdAt: notification.createdAt
            });
            this.logger.log(`Notification sent to user ${userId}: ${notification.title}`);
        }
        else {
            this.logger.log(`User ${userId} not connected, notification will be delivered when they connect`);
        }
    }
    sendNotificationToUsers(userIds, notification) {
        userIds.forEach(userId => {
            this.sendNotificationToUser(userId, notification);
        });
    }
    broadcastNotification(notification) {
        this.server.emit('broadcastNotification', {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            data: notification.data,
            createdAt: notification.createdAt
        });
        this.logger.log(`Broadcast notification sent: ${notification.title}`);
    }
    updateUnreadCount(userId, count) {
        const user = this.connectedUsers.get(userId);
        if (user) {
            this.server.to(user.socketId).emit('unreadCountUpdate', { count });
        }
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handleSubscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getUnreadCount'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleGetUnreadCount", null);
exports.NotificationGateway = NotificationGateway = NotificationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: true,
        namespace: '/notifications',
        transports: ['websocket', 'polling']
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map