import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ namespace: '/chat', cors: true })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Chat WebSocket Gateway initialized');
    server.use(async (socket: Socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          this.logger.warn(`Connection attempt without token from ${socket.handshake.address}`);
          return next(new Error('Authentication error: No token provided'));
        }
        console.log(`Authenticating user with token: ${token}`);
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
        console.log(`Authenticated user payload:`, payload);
        socket.data.user = payload;
        this.logger.log(`User ${payload.id} authenticated successfully`);
        next();
      } catch (error) {
        this.logger.error(`Authentication failed: ${error.message}`);
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  // Join a chat room (by chatId)
  @SubscribeMessage('join')
  async handleJoin(@MessageBody() data: { chatId: number }, @ConnectedSocket() client: Socket) {
    client.join(`chat_${data.chatId}`);
  }

  // Create a chat (provide only one id, get the other from authenticated user)
  @SubscribeMessage('create_chat')
  async handleCreateChat(
    @MessageBody() data: { otherId: number },
    @ConnectedSocket() client: Socket
  ) {
    const user = client.data.user;
    let studentId: number, teacherId: number;
    if (user.role === 'Student') {
      studentId = user.studentId;
      teacherId = data.otherId;
    } else if (user.role === 'Teacher') {
      teacherId = user.teacherId;
      studentId = data.otherId;
    } else {
      throw new Error('User must be a student or teacher');
    }
    const chat = await this.chatService.findOrCreateChat(studentId, teacherId);
    client.join(`chat_${chat.id}`);
    return { chatId: chat.id, chat };
  }

  // Send a message (requires chatId)
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { chatId: number; message: string },
    @ConnectedSocket() client: Socket
  ) {
    const user = client.data.user;
    const chat = await this.chatService.findOneById(data.chatId);
    if (!chat) throw new Error('Chat not found');
    const msg = await this.chatService.saveMessage(chat, user.id, data.message);
    this.server.to(`chat_${chat.id}`).emit('new_message', msg);
    client.join(`chat_${chat.id}`);
    return msg;
  }
} 