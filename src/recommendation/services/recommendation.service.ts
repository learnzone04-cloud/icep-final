import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../entities/UserProfile';
import { UserRecommendation } from '../entities/UserRecommendation';
import { UserInteraction } from '../entities/UserInteraction';
import { UserTagPreference } from '../entities/UserTagPreference';
import { TagsService } from '../../tags/tags.service';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(UserRecommendation)
    private userRecommendationRepository: Repository<UserRecommendation>,
    @InjectRepository(UserInteraction)
    private userInteractionRepository: Repository<UserInteraction>,
    @InjectRepository(UserTagPreference)
    private userTagPreferenceRepository: Repository<UserTagPreference>,
    private tagsService: TagsService,
  ) {}

  // Calculate recommendation score for a piece of content
  calculateContentScore(
    userProfile: UserProfile,
    contentLevel: string,
    teacherId: number,
    isTeacherFollowed: boolean,
    engagementMultiplier: number = 1.0,
    recencyFactor: number = 1.0,
  ): {
    totalScore: number;
    levelScore: number;
    tagScore: number;
    teacherScore: number;
    engagementMultiplier: number;
    recencyFactor: number;
  } {
    // 1. Level Match Score (40% weight)
    const levelScore = this.calculateLevelScore(userProfile.levelPreference, contentLevel);

    // 2. Tag Match Score (30% weight) - Will be calculated separately when we have content data
    const tagScore = 0.5; // Default, will be updated when we query actual content

    // 3. Teacher Follow Score (30% weight)
    const teacherScore = isTeacherFollowed ? 1.0 : 0.3;

    // 4. Calculate weighted base score
    const baseScore = (levelScore * 0.4) + (tagScore * 0.3) + (teacherScore * 0.3);

    // 5. Apply engagement multiplier and recency factor
    const totalScore = baseScore * engagementMultiplier * recencyFactor;

    return {
      totalScore,
      levelScore,
      tagScore,
      teacherScore,
      engagementMultiplier,
      recencyFactor,
    };
  }

  // Calculate level match score
  private calculateLevelScore(userLevel: string, contentLevel: string): number {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const userIndex = levels.indexOf(userLevel);
    const contentLevels = contentLevel.split(',').map(l => l.trim());
    
    if (userIndex === -1) return 0.5; // Default score if level not found

    let bestScore = 0;
    for (const level of contentLevels) {
      const contentIndex = levels.indexOf(level);
      if (contentIndex === -1) continue;

      const levelDiff = Math.abs(userIndex - contentIndex);
      let score = 1.0;
      
      if (levelDiff === 0) score = 1.0; // Exact match
      else if (levelDiff === 1) score = 0.8; // One level difference
      else if (levelDiff === 2) score = 0.6; // Two levels difference
      else score = 0.3; // More than 2 levels difference

      bestScore = Math.max(bestScore, score);
    }

    return bestScore;
  }

  // Calculate tag match score using dynamic tags from database
  async calculateTagScore(userId: number, contentTags: string, userTypeId: number): Promise<number> {
    const tags = contentTags.split(',').map(t => t.trim().toLowerCase());
    
    if (tags.length === 0) return 0.5;

    let totalScore = 0;
    let tagCount = 0;

    for (const tagName of tags) {
      // Get user's preference for this specific tag
      const tagPreference = await this.userTagPreferenceRepository.findOne({
        where: { userId, tagId: tagName as any }, // This will be updated to use actual tag IDs
      });

      let score = 0.5; // Default neutral score
      
      if (tagPreference) {
        score = tagPreference.score;
      }

      totalScore += score;
      tagCount++;
    }

    return tagCount > 0 ? totalScore / tagCount : 0.5;
  }

  // Calculate engagement multiplier based on user's past behavior
  async calculateEngagementMultiplier(
    userId: number,
    contentType: string,
    contentTags: string,
  ): Promise<number> {
    const recentInteractions = await this.userInteractionRepository.find({
      where: { userId, contentType: contentType as any },
      order: { timestamp: 'DESC' },
      take: 50, // Last 50 interactions
    });

    if (recentInteractions.length === 0) return 1.0;

    let totalEngagement = 0;
    let interactionCount = 0;

    for (const interaction of recentInteractions) {
      let engagement = 0.5; // Default neutral engagement

      if (interaction.watchPercentage) {
        engagement = interaction.watchPercentage / 100;
      } else if (interaction.scrollPercentage) {
        engagement = interaction.scrollPercentage / 100;
      }

      if (interaction.liked) engagement += 0.2;
      if (interaction.commented) engagement += 0.3;
      if (interaction.saved) engagement += 0.2;
      if (interaction.shared) engagement += 0.1;

      totalEngagement += Math.min(engagement, 1.0); // Cap at 1.0
      interactionCount++;
    }

    const averageEngagement = totalEngagement / interactionCount;
    
    // Convert to multiplier (0.5 engagement = 0.8x, 1.0 engagement = 1.2x)
    return 0.8 + (averageEngagement * 0.4);
  }

  // Calculate recency factor
  calculateRecencyFactor(createdAt: Date): number {
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 1) return 1.2; // Very recent content
    if (hoursDiff < 6) return 1.1; // Recent content
    if (hoursDiff < 24) return 1.0; // Same day
    if (hoursDiff < 72) return 0.9; // Few days old
    return 0.8; // Older content
  }

  // Get recommendations for a user
  async getRecommendations(
    userId: number,
    contentType: 'reel' | 'article' | 'short_video',
    limit: number = 20,
  ): Promise<UserRecommendation[]> {
    const recommendations = await this.userRecommendationRepository.find({
      where: { userId, contentType },
      order: { score: 'DESC' },
      take: limit,
    });

    return recommendations;
  }

  // Check if recommendations are fresh
  async areRecommendationsFresh(userId: number, contentType: string): Promise<boolean> {
    const latestRecommendation = await this.userRecommendationRepository.findOne({
      where: { userId, contentType: contentType as any },
      order: { cachedAt: 'DESC' },
    });

    if (!latestRecommendation) return false;

    const now = new Date();
    const hoursSinceCache = (now.getTime() - latestRecommendation.cachedAt.getTime()) / (1000 * 60 * 60);

    return hoursSinceCache < 6; // Fresh if less than 6 hours old
  }

  // Update user tag preferences based on interactions
  async updateUserTagPreferences(userId: number, contentTags: string, engagement: number): Promise<void> {
    const tags = contentTags.split(',').map(t => t.trim().toLowerCase());
    
    for (const tagName of tags) {
      // Find or create tag preference
      let tagPreference = await this.userTagPreferenceRepository.findOne({
        where: { userId, tagId: tagName as any }, // This will be updated to use actual tag IDs
      });

      if (!tagPreference) {
        tagPreference = this.userTagPreferenceRepository.create({
          userId,
          tagId: tagName as any, // This will be updated to use actual tag IDs
          score: 0.5,
          interactionCount: 0,
        });
      }

      // Update score based on engagement
      const currentScore = tagPreference.score;
      const newScore = (currentScore + engagement) / 2; // Average of current and new engagement
      
      tagPreference.score = Math.max(0.0, Math.min(1.0, newScore)); // Clamp between 0 and 1
      tagPreference.interactionCount += 1;

      await this.userTagPreferenceRepository.save(tagPreference);
    }
  }
}

