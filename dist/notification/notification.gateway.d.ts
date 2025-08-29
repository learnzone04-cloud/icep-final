import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Notification } from './entity/Notification';
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private readonly jwtService;
    server: Server;
    private readonly logger;
    private connectedUsers;
    constructor(jwtService: JwtService);
    afterInit(server: Server): void;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    handleSubscribe(socket: Socket): void;
    handleGetUnreadCount(socket: Socket): Promise<void>;
    sendNotificationToUser(userId: number, notification: Notification): void;
    sendNotificationToUsers(userIds: number[], notification: Notification): void;
    broadcastNotification(notification: Notification): void;
    updateUnreadCount(userId: number, count: number): void;
}
