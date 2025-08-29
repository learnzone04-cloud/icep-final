import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

interface OnlineUser {
  userId: number;
  socketId: string;
}

@WebSocketGateway({
  cors: true,
  namespace: '/story',
  transports: ['websocket', 'polling'],
})
export class StoryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(StoryGateway.name);
  private onlineUsers: Map<number, OnlineUser> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(socket: Socket) {
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
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    const userId = socket.data.user?.id;
    if (userId && this.onlineUsers.has(userId)) {
      this.onlineUsers.delete(userId);
      this.logger.log(`User ${userId} disconnected from story gateway (${socket.id})`);
    }
  }

  // Emit story events to specific userIds (followers)
  emitStoryCreated(story: any, followerUserIds: number[]) {
    this.emitToUsers('storyCreated', story, followerUserIds);
  }

  emitStoryDeleted(storyId: number, followerUserIds: number[]) {
    this.emitToUsers('storyDeleted', { id: storyId }, followerUserIds);
  }

  private emitToUsers(event: string, payload: any, userIds: number[]) {
    userIds.forEach((userId) => {
      const user = this.onlineUsers.get(userId);
      if (user) {
        this.server.to(user.socketId).emit(event, payload);
        this.logger.log(`Emitted ${event} to user ${userId}`);
      }
    });
  }
} 