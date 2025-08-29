import { Test, TestingModule } from '@nestjs/testing';
import { HubGateway } from './hub.gateway';
import { HubService } from './hub.service';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

describe('HubGateway', () => {
  let gateway: HubGateway;
  let hubService: HubService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HubGateway,
        {
          provide: HubService,
          useValue: {
            saveMessage: jest.fn(),
            getMessages: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<HubGateway>(HubGateway);
    hubService = module.get<HubService>(HubService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should log connection', () => {
      const mockSocket = {
        id: 'test-socket-id',
        data: { user: { id: 1 } },
      } as Socket;

      const logSpy = jest.spyOn(gateway['logger'], 'log');
      gateway.handleConnection(mockSocket);
      
      expect(logSpy).toHaveBeenCalledWith('Client connected: test-socket-id (User: 1)');
    });
  });

  describe('handleDisconnect', () => {
    it('should remove user from online users', () => {
      const mockSocket = {
        id: 'test-socket-id',
        data: { user: { id: 1 } },
      } as Socket;

      // Add user to online users first
      gateway['onlineUsers'].set(1, {
        userId: 1,
        socketId: 'test-socket-id',
        lastMessageTime: 0,
      });

      const logSpy = jest.spyOn(gateway['logger'], 'log');
      gateway.handleDisconnect(mockSocket);
      
      expect(gateway['onlineUsers'].has(1)).toBeFalsy();
      expect(logSpy).toHaveBeenCalledWith('Client disconnected: test-socket-id (User: 1)');
    });
  });
}); 