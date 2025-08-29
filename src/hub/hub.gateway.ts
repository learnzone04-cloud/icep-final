import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { HubService } from './hub.service';
import { JwtService } from '@nestjs/jwt';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from './ws-jwt-auth.guard';
import { SendMessageDto } from './dtos/send-message.dto';
import { GetHistoryDto } from './dtos/get-history.dto';

interface OnlineUser {
  userId: number;
  socketId: string;
  lastMessageTime: number;
}

@WebSocketGateway({ 
  cors: true,
  namespace: '/hub',
  transports: ['websocket', 'polling']
})
export class HubGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(HubGateway.name);
  private onlineUsers: Map<number, OnlineUser> = new Map();
  private readonly RATE_LIMIT_MS = 1000; // 1 second between messages

  constructor(
    private readonly hubService: HubService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Hub WebSocket Gateway initialized');
    
    // Add authentication middleware
    server.use(async (socket: Socket, next) => {
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
      } catch (error) {
        this.logger.error(`Authentication failed: ${error.message}`);
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  async handleConnection(socket: Socket) {
    const userId = socket.data.user?.id || 'unknown';
    this.logger.log(`Client connected: ${socket.id} (User: ${userId})`);
  }

  async handleDisconnect(socket: Socket) {
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

  @SubscribeMessage('register')
  handleRegister(@ConnectedSocket() socket: Socket) {
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

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const senderId = socket.data.user.id;
      
      // Rate limiting check
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
      // Add fullName to the message
      const fullName = message.sender ? `${message.sender.fName} ${message.sender.lName}` : null;
      this.server.emit('newMessage', { ...message, fullName });
      this.logger.log(`Message sent by user ${senderId}: ${data.content.substring(0, 50)}...`);
    } catch (error) {
      this.logger.error(`Failed to send message: ${error.message}`);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('getHistory')
  async handleGetHistory(
    @MessageBody() data: GetHistoryDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const userId = socket.data.user.id;
      const messages = await this.hubService.getMessages(data.limit, data.beforeId);
      socket.emit('history', messages);
      this.logger.log(`History requested by user ${userId}, returned ${messages.length} messages`);
    } catch (error) {
      this.logger.error(`Failed to get message history: ${error.message}`);
      socket.emit('error', { message: 'Failed to get message history' });
    }
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() socket: Socket) {
    const userId = socket.data.user.id;
    const onlineUserIds = Array.from(this.onlineUsers.keys());
    socket.emit('onlineUsers', onlineUserIds);
    this.logger.log(`Online users requested by user ${userId}, returned ${onlineUserIds.length} users`);
  }

  private broadcastOnlineUsers() {
    const onlineUserIds = Array.from(this.onlineUsers.keys());
    this.server.emit('onlineUsers', onlineUserIds);
    this.logger.log(`Broadcasted online users: ${onlineUserIds.length} users`);
  }
}
