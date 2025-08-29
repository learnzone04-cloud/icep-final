import { Repository } from 'typeorm';
import { UserProfile } from '../entities/UserProfile';
import { UserRecommendation } from '../entities/UserRecommendation';
import { UserInteraction } from '../entities/UserInteraction';
import { UserTagPreference } from '../entities/UserTagPreference';
import { TagsService } from '../../tags/tags.service';
export declare class RecommendationService {
    private userProfileRepository;
    private userRecommendationRepository;
    private userInteractionRepository;
    private userTagPreferenceRepository;
    private tagsService;
    constructor(userProfileRepository: Repository<UserProfile>, userRecommendationRepository: Repository<UserRecommendation>, userInteractionRepository: Repository<UserInteraction>, userTagPreferenceRepository: Repository<UserTagPreference>, tagsService: TagsService);
    calculateContentScore(userProfile: UserProfile, contentLevel: string, teacherId: number, isTeacherFollowed: boolean, engagementMultiplier?: number, recencyFactor?: number): {
        totalScore: number;
        levelScore: number;
        tagScore: number;
        teacherScore: number;
        engagementMultiplier: number;
        recencyFactor: number;
    };
    private calculateLevelScore;
    calculateTagScore(userId: number, contentTags: string, userTypeId: number): Promise<number>;
    calculateEngagementMultiplier(userId: number, contentType: string, contentTags: string): Promise<number>;
    calculateRecencyFactor(createdAt: Date): number;
    getRecommendations(userId: number, contentType: 'reel' | 'article' | 'short_video', limit?: number): Promise<UserRecommendation[]>;
    areRecommendationsFresh(userId: number, contentType: string): Promise<boolean>;
    updateUserTagPreferences(userId: number, contentTags: string, engagement: number): Promise<void>;
}
