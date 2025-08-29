import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { Student } from '../student/entity/Student';
import { TeacherEntity } from '../teacher/entity/Teacher';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    @InjectRepository(ChatMessage) private messageRepo: Repository<ChatMessage>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(TeacherEntity) private teacherRepo: Repository<TeacherEntity>,
  ) {}

  async findOrCreateChat(studentId: number, teacherId: number): Promise<Chat> {
    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    const teacher = await this.teacherRepo.findOne({ where: { id: teacherId } });
    if (!student || !teacher) throw new Error('Student or Teacher not found');
    let chat = await this.chatRepo.findOne({ where: { student: { id: studentId }, teacher: { id: teacherId } } });
    if (!chat) {
      chat = this.chatRepo.create({ student, teacher });
      await this.chatRepo.save(chat);
    }
    return chat;
  }

  async saveMessage(chat: Chat, senderId: number, message: string): Promise<ChatMessage> {
    const msg = this.messageRepo.create({ chat, senderId, message });
    console.log('Saving message:', msg);
    return this.messageRepo.save(msg);
  }

  async getChatMessages(chat: Chat) {
    console.log('Looking for messages for chat:', chat);
    const messages = await this.messageRepo.find({ where: { chat: { id: chat.id } }, order: { createdAt: 'ASC' } });
    console.log('Messages:', messages);
    return messages;
  }

  async getUserChats(userId: number): Promise<Chat[]> {
    // Find all chats where the user is either the student or the teacher (by userId)
    const student = await this.studentRepo.findOne({ where: { userId } });
    const teacher = await this.teacherRepo.findOne({ where: { userId } });
    const where = [];
    if (student) where.push({ student: { id: student.id } });
    if (teacher) where.push({ teacher: { id: teacher.id } });
    if (where.length === 0) return [];
    return this.chatRepo.find({ where, order: { updatedAt: 'DESC' } , relations: ['student','student.user', 'teacher', 'teacher.user',] });
  }

  async getChatById(chatId: number): Promise<Chat | null> {
    return this.chatRepo.findOne({ where: { id: chatId } });
  }

  async getChatByParticipants(studentId: number, teacherId: number): Promise<Chat | null> {
    return this.chatRepo.findOne({ where: { student: { id: studentId }, teacher: { id: teacherId } } });
  }

  async findOneById(id: number) {
    return this.chatRepo.findOne({
      where: { id },
      relations: ['student', 'teacher'],
    });
  }
} 