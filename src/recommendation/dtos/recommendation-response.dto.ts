export class RecommendationResponseDto {
  contentId: number;
  contentType: 'reel' | 'article' | 'short_video';
  score: number;
  rank: number;
  
  // Content details
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  
  // Metadata for debugging
  levelScore: number;
  tagScore: number;
  teacherScore: number;
  engagementMultiplier: number;
  recencyFactor: number;
  
  // Content level
  contentLevel: string;
  teacherId: number;
  isTeacherFollowed: boolean;
  
  // Cache info
  cachedAt: Date;
  expiresAt: Date;
}

export class GetRecommendationsResponseDto {
  userId: number;
  contentType: 'reel' | 'article' | 'short_video';
  recommendations: RecommendationResponseDto[];
  totalCount: number;
  cacheStatus: 'fresh' | 'stale' | 'expired';
  generatedAt: Date;
}

