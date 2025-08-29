import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../entities/UserProfile';
import { UserRecommendation } from '../entities/UserRecommendation';
import { UserInteraction } from '../entities/UserInteraction';
import { RecommendationService } from './recommendation.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BackgroundJobService {
  private readonly logger = new Logger(BackgroundJobService.name);

  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(UserRecommendation)
    private userRecommendationRepository: Repository<UserRecommendation>,
    @InjectRepository(UserInteraction)
    private userInteractionRepository: Repository<UserInteraction>,
    private recommendationService: RecommendationService,
  ) {}

  // Run every 6 hours to process interactions and update profiles
  @Cron(CronExpression.EVERY_6_HOURS)
  async processInteractionsAndUpdateProfiles() {
    this.logger.log('Starting background job: Process interactions and update profiles');
    
    try {
      // Get all users with recent interactions
      const usersWithInteractions = await this.getUsersWithRecentInteractions();
      
      for (const userId of usersWithInteractions) {
        await this.updateUserProfile(userId);
      }
      
      this.logger.log(`Updated profiles for ${usersWithInteractions.length} users`);
    } catch (error) {
      this.logger.error('Error in background job: Process interactions and update profiles', error);
    }
  }

  // Run every 6 hours to generate new recommendations
  @Cron(CronExpression.EVERY_6_HOURS)
  async generateRecommendations() {
    this.logger.log('Starting background job: Generate recommendations');
    
    try {
      // Get all users with profiles
      const userProfiles = await this.userProfileRepository.find();
      
      for (const profile of userProfiles) {
        await this.generateUserRecommendations(profile.userId);
      }
      
      this.logger.log(`Generated recommendations for ${userProfiles.length} users`);
    } catch (error) {
      this.logger.error('Error in background job: Generate recommendations', error);
    }
  }

  // Run daily to clean up old interaction data
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldInteractions() {
    this.logger.log('Starting background job: Cleanup old interactions');
    
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 14); // Keep only 2 weeks of data
      
      const result = await this.userInteractionRepository.delete({
        timestamp: { $lt: cutoffDate } as any,
      });
      
      this.logger.log(`Cleaned up ${result.affected} old interaction records`);
    } catch (error) {
      this.logger.error('Error in background job: Cleanup old interactions', error);
    }
  }

  // Get users with recent interactions (last 7 days)
  private async getUsersWithRecentInteractions(): Promise<number[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);

    const interactions = await this.userInteractionRepository
      .createQueryBuilder('interaction')
      .select('DISTINCT interaction.userId', 'userId')
      .where('interaction.timestamp >= :cutoffDate', { cutoffDate })
      .getRawMany();

    return interactions.map(i => i.userId);
  }

  // Update user profile based on recent interactions
  private async updateUserProfile(userId: number): Promise<void> {
    const recentInteractions = await this.userInteractionRepository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
      take: 100, // Last 100 interactions
    });

    if (recentInteractions.length === 0) return;

    // Calculate average engagement metrics
    const engagementMetrics = this.calculateEngagementMetrics(recentInteractions);
    
    // Calculate tag preference scores
    const tagScores = await this.calculateTagScores(userId, recentInteractions);
    
    // Get or create user profile
    let userProfile = await this.userProfileRepository.findOne({ where: { userId } });
    if (!userProfile) {
      userProfile = this.userProfileRepository.create({
        userId,
        levelPreference: 'A1', // Default level
        ...tagScores,
        ...engagementMetrics,
        followedTeachersCount: 0, // Will be updated separately
        totalInteractions: recentInteractions.length,
      });
    } else {
      // Update existing profile with new scores
      Object.assign(userProfile, tagScores, engagementMetrics);
      userProfile.totalInteractions = recentInteractions.length;
    }

    await this.userProfileRepository.save(userProfile);
  }

  // Calculate engagement metrics from interactions
  private calculateEngagementMetrics(interactions: UserInteraction[]): {
    averageWatchPercentage: number;
    averageScrollPercentage: number;
  } {
    let totalWatchPercentage = 0;
    let totalScrollPercentage = 0;
    let watchCount = 0;
    let scrollCount = 0;

    for (const interaction of interactions) {
      if (interaction.watchPercentage !== null) {
        totalWatchPercentage += interaction.watchPercentage;
        watchCount++;
      }
      if (interaction.scrollPercentage !== null) {
        totalScrollPercentage += interaction.scrollPercentage;
        scrollCount++;
      }
    }

    return {
      averageWatchPercentage: watchCount > 0 ? totalWatchPercentage / watchCount : 50,
      averageScrollPercentage: scrollCount > 0 ? totalScrollPercentage / scrollCount : 50,
    };
  }

  // Calculate tag preference scores based on interactions
  private async calculateTagScores(userId: number, interactions: UserInteraction[]): Promise<Partial<UserProfile>> {
    // This is a simplified version - in production, you'd query content tables
    // to get the actual tags for each interacted content
    const tagScores: Partial<UserProfile> = {};
    
    // Initialize all tag scores to neutral (0.5)
    const allTags = [
      'grammarScore', 'vocabsScore', 'speakingScore', 'mirroringScore',
      'movieExplanationScore', 'ieltsScore', 'sportsScore', 'booksScore',
      'novelsScore', 'conversationScore', 'worksScore', 'cvScore',
      'medicalScore', 'engineerScore', 'economicScore', 'slangsScore',
      'interviewsScore', 'tradingScore', 'itScore'
    ];

    for (const tag of allTags) {
      tagScores[tag] = 0.5;
    }

    // TODO: In production, implement logic to:
    // 1. Query content tables to get tags for each interaction
    // 2. Calculate weighted scores based on engagement level
    // 3. Update tagScores accordingly

    return tagScores;
  }

  // Generate recommendations for a specific user
  private async generateUserRecommendations(userId: number): Promise<void> {
    const userProfile = await this.userProfileRepository.findOne({ where: { userId } });
    if (!userProfile) return;

    // TODO: In production, implement logic to:
    // 1. Query all available content (reels, articles, short videos)
    // 2. Calculate scores for each piece of content using the actual content data
    // 3. Rank and store top recommendations
    // 4. Set expiration times for cache refresh

    // For now, we'll create a placeholder recommendation
    // In the future, this should query actual content tables and calculate real scores
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 6); // Expire in 6 hours

    const recommendation = this.userRecommendationRepository.create({
      userId,
      contentId: 1, // Placeholder - should be actual content ID
      contentType: 'reel',
      score: 0.8,
      rank: 1,
      levelScore: 0.8,
      tagScore: 0.7,
      teacherScore: 0.9,
      engagementMultiplier: 1.1,
      recencyFactor: 1.0,
      contentLevel: userProfile.levelPreference,
      teacherId: 1,
      isTeacherFollowed: true,
      expiresAt,
    });

    await this.userRecommendationRepository.save(recommendation);
  }

  // Manual trigger for testing
  async manualProcessRecommendations(userId: number): Promise<void> {
    this.logger.log(`Manual processing recommendations for user ${userId}`);
    await this.updateUserProfile(userId);
    await this.generateUserRecommendations(userId);
  }
}

