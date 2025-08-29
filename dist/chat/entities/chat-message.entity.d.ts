import { Chat } from './chat.entity';
export declare class ChatMessage {
    id: number;
    chat: Chat;
    senderId: number;
    message: string;
    createdAt: Date;
}
