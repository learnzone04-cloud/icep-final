export declare class RecommendationResponseDto {
    contentId: number;
    contentType: 'reel' | 'article' | 'short_video';
    score: number;
    rank: number;
    title?: string;
    description?: string;
    thumbnail?: string;
    duration?: number;
    levelScore: number;
    tagScore: number;
    teacherScore: number;
    engagementMultiplier: number;
    recencyFactor: number;
    contentLevel: string;
    teacherId: number;
    isTeacherFollowed: boolean;
    cachedAt: Date;
    expiresAt: Date;
}
export declare class GetRecommendationsResponseDto {
    userId: number;
    contentType: 'reel' | 'article' | 'short_video';
    recommendations: RecommendationResponseDto[];
    totalCount: number;
    cacheStatus: 'fresh' | 'stale' | 'expired';
    generatedAt: Date;
}
