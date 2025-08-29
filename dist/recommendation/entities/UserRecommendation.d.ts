export declare class UserRecommendation {
    id: number;
    userId: number;
    contentId: number;
    contentType: 'reel' | 'article' | 'short_video';
    score: number;
    rank: number;
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
