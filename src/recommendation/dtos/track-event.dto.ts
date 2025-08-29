import { IsNumber, IsString, IsOptional, IsBoolean, IsEnum, Min, Max } from 'class-validator';

export class TrackEventDto {
  @IsNumber()
  contentId: number;

  @IsEnum(['reel', 'article', 'short_video'])
  contentType: 'reel' | 'article' | 'short_video';

  // Video/Reel specific metrics
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(3600) // Max 1 hour
  watchTime?: number; // in seconds

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3600) // Max 1 hour
  totalTime?: number; // in seconds

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  watchPercentage?: number; // 0-100

  // Article specific metrics
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  scrollPercentage?: number; // 0-100

  // General engagement metrics
  @IsOptional()
  @IsBoolean()
  liked?: boolean;

  @IsOptional()
  @IsBoolean()
  commented?: boolean;

  @IsOptional()
  @IsBoolean()
  followed?: boolean;

  @IsOptional()
  @IsBoolean()
  shared?: boolean;

  @IsOptional()
  @IsBoolean()
  saved?: boolean;

  // Additional context
  @IsOptional()
  @IsString()
  sessionId?: string; // For real-time adjustments
}

