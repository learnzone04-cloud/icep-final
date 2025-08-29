import { OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class ChatGateway implements OnGatewayInit {
    private readonly chatService;
    private readonly jwtService;
    private readonly configService;
    server: Server;
    private readonly logger;
    constructor(chatService: ChatService, jwtService: JwtService, configService: ConfigService);
    afterInit(server: Server): void;
    handleJoin(data: {
        chatId: number;
    }, client: Socket): Promise<void>;
    handleCreateChat(data: {
        otherId: number;
    }, client: Socket): Promise<{
        chatId: number;
        chat: import("./entities/chat.entity").Chat;
    }>;
    handleSendMessage(data: {
        chatId: number;
        message: string;
    }, client: Socket): Promise<import("./entities/chat-message.entity").ChatMessage>;
}
