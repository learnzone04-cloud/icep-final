import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HubService } from './hub.service';
import { JwtService } from '@nestjs/jwt';
import { SendMessageDto } from './dtos/send-message.dto';
import { GetHistoryDto } from './dtos/get-history.dto';
export declare class HubGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private readonly hubService;
    private readonly jwtService;
    server: Server;
    private readonly logger;
    private onlineUsers;
    private readonly RATE_LIMIT_MS;
    constructor(hubService: HubService, jwtService: JwtService);
    afterInit(server: Server): void;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    handleRegister(socket: Socket): void;
    handleMessage(data: SendMessageDto, socket: Socket): Promise<void>;
    handleGetHistory(data: GetHistoryDto, socket: Socket): Promise<void>;
    handleGetOnlineUsers(socket: Socket): void;
    private broadcastOnlineUsers;
}
