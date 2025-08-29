import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RecommendationService } from '../services/recommendation.service';
export declare class RecommendationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly recommendationService;
    server: Server;
    private readonly logger;
    private userSessions;
    constructor(recommendationService: RecommendationService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinSession(data: {
        userId: number;
        sessionId: string;
    }, client: Socket): void;
    handleSessionInteraction(data: {
        sessionId: string;
        contentType: string;
        contentTags: string;
        engagement: number;
    }, client: Socket): void;
    handleGetSessionRecommendations(data: {
        sessionId: string;
        contentType: string;
        limit: number;
    }, client: Socket): Promise<void>;
    private applySessionAdjustments;
    private calculateSessionTagPreferences;
    private calculateTimeWeight;
    notifyUserNewRecommendations(userId: number, contentType: string): Promise<void>;
    notifyUserProfileUpdated(userId: number): Promise<void>;
}
