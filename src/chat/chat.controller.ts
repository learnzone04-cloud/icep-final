import { Controller, Get, Param, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateChatDto, SendMessageDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('user/:userId')
  async getUserChats(@Param('userId') userId: number) {
    return this.chatService.getUserChats(userId);
  }

  @Get(':chatId/messages')
  async getChatMessages(@Param('chatId') chatId: number) {
    const chat = await this.chatService.findOneById(chatId);
    if (!chat) throw new Error('Chat not found');
    return this.chatService.getChatMessages(chat);
  }

  // New: Create a chat between a student and teacher
  @UseGuards(JwtAuthGuard)
  @Post()
  async createChat(@Body() body: CreateChatDto) {
    const chat = await this.chatService.findOrCreateChat(body.studentId, body.teacherId);
    return { chatId: chat.id, chat };
  }

  // New: Get chat by studentId and teacherId
  @UseGuards(JwtAuthGuard)
  @Get('by-participants')
  async getChatByParticipants(@Query('studentId') studentId: number, @Query('teacherId') teacherId: number) {
    const chat = await this.chatService.getChatByParticipants(Number(studentId), Number(teacherId));
    if (!chat) return { chatId: null };
    return { chatId: chat.id, chat };
  }

  // Refactored: Send message to a chat by chatId
  @UseGuards(JwtAuthGuard)
  @Post('message')
  async sendMessage(@Body() body: SendMessageDto, @Req() req) {
    console.log('Controller received body:', body);
    const user = req.user;
    const senderId = user.id;
    const chat = await this.chatService.findOneById(body.chatId);
    if (!chat) throw new Error('Chat not found');
    const message = await this.chatService.saveMessage(chat, senderId, body.message);
    return { chat, message };
  }
} 