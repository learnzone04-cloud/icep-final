import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Notification } from './entity/Notification';

interface ConnectedUser {
  userId: number;
  socketId: string;
}

@WebSocketGateway({ 
  cors: true,
  namespace: '/notifications',
  transports: ['websocket', 'polling']
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private connectedUsers: Map<number, ConnectedUser> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: Server) {
    this.logger.log('Notification WebSocket Gateway initialized');
    
    // Add authentication middleware
    server.use(async (socket: Socket, next) => {
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
      } catch (error) {
        this.logger.error(`Notification authentication failed: ${error.message}`);
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  async handleConnection(socket: Socket) {
    const userId = socket.data.user?.id;
    if (userId) {
      this.connectedUsers.set(userId, {
        userId,
        socketId: socket.id
      });
      this.logger.log(`User ${userId} connected to notifications`);
    }
  }

  async handleDisconnect(socket: Socket) {
    const userId = socket.data.user?.id;
    if (userId) {
      this.connectedUsers.delete(userId);
      this.logger.log(`User ${userId} disconnected from notifications`);
    }
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(@ConnectedSocket() socket: Socket) {
    const userId = socket.data.user.id;
    socket.emit('subscribed', { userId });
    this.logger.log(`User ${userId} subscribed to notifications`);
  }

  @SubscribeMessage('getUnreadCount')
  async handleGetUnreadCount(@ConnectedSocket() socket: Socket) {
    const userId = socket.data.user.id;
    // This will be handled by the notification service
    socket.emit('unreadCount', { count: 0 }); // Placeholder
  }

  // Method to send notification to a specific user
  sendNotificationToUser(userId: number, notification: Notification) {
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
    } else {
      this.logger.log(`User ${userId} not connected, notification will be delivered when they connect`);
    }
  }

  // Method to send notification to multiple users
  sendNotificationToUsers(userIds: number[], notification: Notification) {
    userIds.forEach(userId => {
      this.sendNotificationToUser(userId, notification);
    });
  }

  // Method to broadcast to all connected users
  broadcastNotification(notification: Notification) {
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

  // Method to update unread count for a user
  updateUnreadCount(userId: number, count: number) {
    const user = this.connectedUsers.get(userId);
    if (user) {
      this.server.to(user.socketId).emit('unreadCountUpdate', { count });
    }
  }
} 