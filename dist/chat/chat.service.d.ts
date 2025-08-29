import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { Student } from '../student/entity/Student';
import { TeacherEntity } from '../teacher/entity/Teacher';
export declare class ChatService {
    private chatRepo;
    private messageRepo;
    private studentRepo;
    private teacherRepo;
    constructor(chatRepo: Repository<Chat>, messageRepo: Repository<ChatMessage>, studentRepo: Repository<Student>, teacherRepo: Repository<TeacherEntity>);
    findOrCreateChat(studentId: number, teacherId: number): Promise<Chat>;
    saveMessage(chat: Chat, senderId: number, message: string): Promise<ChatMessage>;
    getChatMessages(chat: Chat): Promise<ChatMessage[]>;
    getUserChats(userId: number): Promise<Chat[]>;
    getChatById(chatId: number): Promise<Chat | null>;
    getChatByParticipants(studentId: number, teacherId: number): Promise<Chat | null>;
    findOneById(id: number): Promise<Chat>;
}
