import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RecommendationService } from '../services/recommendation.service';

interface UserSession {
  userId: number;
  sessionId: string;
  recentInteractions: Array<{
    contentType: string;
    contentTags: string;
    engagement: number;
    timestamp: Date;
  }>;
}

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
export class RecommendationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RecommendationGateway.name);
  private userSessions = new Map<string, UserSession>();

  constructor(private readonly recommendationService: RecommendationService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Clean up user session
    for (const [sessionId, session] of this.userSessions.entries()) {
      if (session.sessionId === client.id) {
        this.userSessions.delete(sessionId);
        break;
      }
    }
  }

  // User joins a recommendation session
  @SubscribeMessage('join-recommendation-session')
  handleJoinSession(
    @MessageBody() data: { userId: number; sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, sessionId } = data;
    
    // Create or update user session
    this.userSessions.set(sessionId, {
      userId,
      sessionId,
      recentInteractions: [],
    });

    // Join user-specific room for targeted updates
    client.join(`user-${userId}`);
    
    this.logger.log(`User ${userId} joined recommendation session ${sessionId}`);
    
    client.emit('session-joined', {
      success: true,
      sessionId,
      message: 'Successfully joined recommendation session',
    });
  }

  // Track real-time interaction for session-based adjustments
  @SubscribeMessage('track-session-interaction')
  handleSessionInteraction(
    @MessageBody() data: {
      sessionId: string;
      contentType: string;
      contentTags: string;
      engagement: number; // 0-1 scale
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, contentType, contentTags, engagement } = data;
    const userSession = this.userSessions.get(sessionId);

    if (!userSession) {
      client.emit('error', { message: 'Session not found' });
      return;
    }

    // Add interaction to session
    userSession.recentInteractions.push({
      contentType,
      contentTags,
      engagement,
      timestamp: new Date(),
    });

    // Keep only last 10 interactions for session
    if (userSession.recentInteractions.length > 10) {
      userSession.recentInteractions.shift();
    }

    this.logger.log(`Tracked session interaction for user ${userSession.userId}: ${contentType} with ${engagement} engagement`);

    // Notify user about interaction tracked
    client.emit('interaction-tracked', {
      success: true,
      contentType,
      engagement,
      sessionInteractionsCount: userSession.recentInteractions.length,
    });
  }

  // Get real-time session-based recommendations
  @SubscribeMessage('get-session-recommendations')
  async handleGetSessionRecommendations(
    @MessageBody() data: {
      sessionId: string;
      contentType: string;
      limit: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, contentType, limit = 20 } = data;
    const userSession = this.userSessions.get(sessionId);

    if (!userSession) {
      client.emit('error', { message: 'Session not found' });
      return;
    }

    try {
      // Get base recommendations from cache
      const baseRecommendations = await this.recommendationService.getRecommendations(
        userSession.userId,
        contentType as any,
        limit,
      );

      // Apply session-based adjustments
      const adjustedRecommendations = this.applySessionAdjustments(
        baseRecommendations,
        userSession.recentInteractions,
      );

      client.emit('session-recommendations', {
        success: true,
        recommendations: adjustedRecommendations,
        sessionInteractionsCount: userSession.recentInteractions.length,
        adjustmentsApplied: adjustedRecommendations.length > 0,
      });

    } catch (error) {
      this.logger.error(`Error getting session recommendations for user ${userSession.userId}`, error);
      client.emit('error', { message: 'Failed to get recommendations' });
    }
  }

  // Apply session-based adjustments to recommendations
  private applySessionAdjustments(
    baseRecommendations: any[],
    recentInteractions: UserSession['recentInteractions'],
  ): any[] {
    if (recentInteractions.length === 0) {
      return baseRecommendations;
    }

    // For now, return base recommendations without tag-based adjustments
    // In the future, this can be enhanced to work with actual content data
    return baseRecommendations;
  }

  // Calculate tag preferences based on recent session interactions
  private calculateSessionTagPreferences(recentInteractions: UserSession['recentInteractions']): Record<string, number> {
    const tagPreferences: Record<string, number> = {};
    
    for (const interaction of recentInteractions) {
      const tags = interaction.contentTags.split(',').map(t => t.trim().toLowerCase());
      
      for (const tag of tags) {
        if (!tagPreferences[tag]) {
          tagPreferences[tag] = 0;
        }
        
        // Weight recent interactions more heavily
        const timeWeight = this.calculateTimeWeight(interaction.timestamp);
        tagPreferences[tag] += interaction.engagement * timeWeight;
      }
    }
    
    // Normalize to 0-1 scale
    const maxValue = Math.max(...Object.values(tagPreferences));
    if (maxValue > 0) {
      for (const tag in tagPreferences) {
        tagPreferences[tag] = tagPreferences[tag] / maxValue;
      }
    }
    
    return tagPreferences;
  }

  // Calculate time weight for recent interactions
  private calculateTimeWeight(timestamp: Date): number {
    const now = new Date();
    const minutesDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60);
    
    if (minutesDiff < 5) return 1.0;      // Last 5 minutes
    if (minutesDiff < 15) return 0.8;     // Last 15 minutes
    if (minutesDiff < 30) return 0.6;     // Last 30 minutes
    if (minutesDiff < 60) return 0.4;     // Last hour
    return 0.2;                            // Older
  }

  // Notify user about new recommendations (called by background jobs)
  async notifyUserNewRecommendations(userId: number, contentType: string) {
    const room = `user-${userId}`;
    this.server.to(room).emit('new-recommendations-available', {
      contentType,
      message: 'New personalized recommendations are available',
      timestamp: new Date(),
    });
    
    this.logger.log(`Notified user ${userId} about new ${contentType} recommendations`);
  }

  // Notify user about profile updates
  async notifyUserProfileUpdated(userId: number) {
    const room = `user-${userId}`;
    this.server.to(room).emit('profile-updated', {
      message: 'Your learning profile has been updated based on recent activity',
      timestamp: new Date(),
    });
    
    this.logger.log(`Notified user ${userId} about profile update`);
  }
}


