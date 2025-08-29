import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let chatService: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: ChatService,
          useValue: {
            findOrCreateChat: jest.fn(),
            saveMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    chatService = module.get<ChatService>(ChatService);
    gateway.server = { to: jest.fn().mockReturnThis(), emit: jest.fn() } as any as Server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleJoin', () => {
    it('should join the client to the chat room', async () => {
      const client = { join: jest.fn() } as any as Socket;
      await gateway.handleJoin({ chatId: 1 }, client);
      expect(client.join).toHaveBeenCalledWith('chat_1');
    });
  });

  describe('handleSendMessage', () => {
    it('should find or create chat, save message, emit new_message, and join the client', async () => {
      const chat = { id: 1 };
      const msg = { id: 1, chatId: 1, senderId: 2, message: 'Hello', createdAt: new Date() };
      (chatService.findOrCreateChat as jest.Mock).mockResolvedValue(chat);
      (chatService.saveMessage as jest.Mock).mockResolvedValue(msg);
      const client = { join: jest.fn() } as any as Socket;
      const data = { studentId: 1, teacherId: 2, senderId: 2, message: 'Hello' };
      const result = await gateway.handleSendMessage(data, client);
      expect(chatService.findOrCreateChat).toHaveBeenCalledWith(1, 2);
      expect(chatService.saveMessage).toHaveBeenCalledWith(1, 2, 'Hello');
      expect(gateway.server.to).toHaveBeenCalledWith('chat_1');
      expect(gateway.server.emit).toHaveBeenCalledWith('new_message', msg);
      expect(client.join).toHaveBeenCalledWith('chat_1');
      expect(result).toBe(msg);
    });
  });

  // Additional tests similar to hub.gateway.spec.ts
  describe('connection', () => {
    it('should allow a client to connect (dummy test for structure)', () => {
      // In a real Socket.IO test, you would simulate a connection event
      // Here, we just check the gateway is ready for connections
      expect(gateway.server).toBeDefined();
    });
  });
}); 