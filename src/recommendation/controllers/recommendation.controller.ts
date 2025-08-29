import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
  Req,
} from '@nestjs/common';
import { RecommendationService } from '../services/recommendation.service';
import { EventTrackingService } from '../services/event-tracking.service';
import { BackgroundJobService } from '../services/background-job.service';
import { TrackEventDto } from '../dtos/track-event.dto';
import { GetRecommendationsResponseDto, RecommendationResponseDto } from '../dtos/recommendation-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('recommendations')
@UseGuards(JwtAuthGuard)
export class RecommendationController {
  private readonly logger = new Logger(RecommendationController.name);

  constructor(
    private readonly recommendationService: RecommendationService,
    private readonly eventTrackingService: EventTrackingService,
    private readonly backgroundJobService: BackgroundJobService,
  ) {}

  // Health check endpoint - MUST be before :contentType route
  @Get('health')
  async healthCheck(): Promise<{ status: string; timestamp: Date }> {
    return {
      status: 'healthy',
      timestamp: new Date(),
    };
  }

  // Get personalized recommendations for a user
  @Get(':contentType')
  async getRecommendations(
    @Param('contentType') contentType: 'reel' | 'article' | 'short_video',
    @Query('limit') limit: number = 20,
    @Req() req: any
  ): Promise<GetRecommendationsResponseDto> {
    const userId = req.user?.id; // Get userId from JWT token
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    this.logger.log(`Getting recommendations for user ${userId}, content type: ${contentType}`);

    try {
      // Check if recommendations are fresh
      const areFresh = await this.recommendationService.areRecommendationsFresh(userId, contentType);
      
      if (!areFresh) {
        this.logger.log(`Recommendations stale for user ${userId}, triggering background update`);
        // Trigger background update (non-blocking)
        this.backgroundJobService.manualProcessRecommendations(userId).catch(error => {
          this.logger.error(`Error in background update for user ${userId}`, error);
        });
      }

      // Get recommendations from cache
      const recommendations = await this.recommendationService.getRecommendations(userId, contentType, limit);
      
      // Convert to response DTOs
      const recommendationResponses: RecommendationResponseDto[] = recommendations.map(rec => ({
        contentId: rec.contentId,
        contentType: rec.contentType,
        score: rec.score,
        rank: rec.rank,
        levelScore: rec.levelScore,
        tagScore: rec.tagScore,
        teacherScore: rec.teacherScore,
        engagementMultiplier: rec.engagementMultiplier,
        recencyFactor: rec.recencyFactor,
        contentLevel: rec.contentLevel,
        teacherId: rec.teacherId,
        isTeacherFollowed: rec.isTeacherFollowed,
        cachedAt: rec.cachedAt,
        expiresAt: rec.expiresAt,
      }));

      const response: GetRecommendationsResponseDto = {
        userId,
        contentType,
        recommendations: recommendationResponses,
        totalCount: recommendationResponses.length,
        cacheStatus: areFresh ? 'fresh' : 'stale',
        generatedAt: new Date(),
      };

      this.logger.log(`Returning ${recommendationResponses.length} recommendations for user ${userId}`);
      return response;

    } catch (error) {
      this.logger.error(`Error getting recommendations for user ${userId}`, error);
      throw error;
    }
  }

  // Track user interaction event
  @Post('track-event')
  async trackEvent(
    @Body() trackEventDto: TrackEventDto,
    @Req() req: any
  ): Promise<{ success: boolean; message: string }> {
    const userId = req.user?.id; // Get userId from JWT token
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    this.logger.log(`Tracking event for user ${userId}, content ${trackEventDto.contentId}`);

    try {
      // Add userId to the DTO
      const eventWithUserId = { ...trackEventDto, userId };
      await this.eventTrackingService.trackEvent(eventWithUserId);
      
      this.logger.log(`Successfully tracked event for user ${userId}`);
      return {
        success: true,
        message: 'Event tracked successfully',
      };
    } catch (error) {
      this.logger.error(`Error tracking event for user ${userId}`, error);
      throw error;
    }
  }

  // Manual trigger for background job (for testing/admin purposes)
  @Post('process-recommendations')
  async manualProcessRecommendations(@Req() req: any): Promise<{ success: boolean; message: string }> {
    const userId = req.user?.id; // Get userId from JWT token
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    this.logger.log(`Manual processing recommendations for user ${userId}`);

    try {
      await this.backgroundJobService.manualProcessRecommendations(userId);
      
      this.logger.log(`Successfully processed recommendations for user ${userId}`);
      return {
        success: true,
        message: 'Recommendations processed successfully',
      };
    } catch (error) {
      this.logger.error(`Error processing recommendations for user ${userId}`, error);
      throw error;
    }
  }
}



