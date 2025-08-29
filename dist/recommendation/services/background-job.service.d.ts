import { Repository } from 'typeorm';
import { UserProfile } from '../entities/UserProfile';
import { UserRecommendation } from '../entities/UserRecommendation';
import { UserInteraction } from '../entities/UserInteraction';
import { RecommendationService } from './recommendation.service';
export declare class BackgroundJobService {
    private userProfileRepository;
    private userRecommendationRepository;
    private userInteractionRepository;
    private recommendationService;
    private readonly logger;
    constructor(userProfileRepository: Repository<UserProfile>, userRecommendationRepository: Repository<UserRecommendation>, userInteractionRepository: Repository<UserInteraction>, recommendationService: RecommendationService);
    processInteractionsAndUpdateProfiles(): Promise<void>;
    generateRecommendations(): Promise<void>;
    cleanupOldInteractions(): Promise<void>;
    private getUsersWithRecentInteractions;
    private updateUserProfile;
    private calculateEngagementMetrics;
    private calculateTagScores;
    private generateUserRecommendations;
    manualProcessRecommendations(userId: number): Promise<void>;
}
