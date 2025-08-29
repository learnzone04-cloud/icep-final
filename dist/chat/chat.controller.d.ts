import { ChatService } from './chat.service';
import { CreateChatDto, SendMessageDto } from './dto/chat.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getUserChats(userId: number): Promise<import("./entities/chat.entity").Chat[]>;
    getChatMessages(chatId: number): Promise<import("./entities/chat-message.entity").ChatMessage[]>;
    createChat(body: CreateChatDto): Promise<{
        chatId: number;
        chat: import("./entities/chat.entity").Chat;
    }>;
    getChatByParticipants(studentId: number, teacherId: number): Promise<{
        chatId: any;
        chat?: undefined;
    } | {
        chatId: number;
        chat: import("./entities/chat.entity").Chat;
    }>;
    sendMessage(body: SendMessageDto, req: any): Promise<{
        chat: import("./entities/chat.entity").Chat;
        message: import("./entities/chat-message.entity").ChatMessage;
    }>;
}
