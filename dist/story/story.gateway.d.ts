import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class StoryGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    server: Server;
    private readonly logger;
    private onlineUsers;
    constructor(jwtService: JwtService);
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    emitStoryCreated(story: any, followerUserIds: number[]): void;
    emitStoryDeleted(storyId: number, followerUserIds: number[]): void;
    private emitToUsers;
}
