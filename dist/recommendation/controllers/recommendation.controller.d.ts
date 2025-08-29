import { RecommendationService } from '../services/recommendation.service';
import { EventTrackingService } from '../services/event-tracking.service';
import { BackgroundJobService } from '../services/background-job.service';
import { TrackEventDto } from '../dtos/track-event.dto';
import { GetRecommendationsResponseDto } from '../dtos/recommendation-response.dto';
export declare class RecommendationController {
    private readonly recommendationService;
    private readonly eventTrackingService;
    private readonly backgroundJobService;
    private readonly logger;
    constructor(recommendationService: RecommendationService, eventTrackingService: EventTrackingService, backgroundJobService: BackgroundJobService);
    healthCheck(): Promise<{
        status: string;
        timestamp: Date;
    }>;
    getRecommendations(contentType: 'reel' | 'article' | 'short_video', limit: number, req: any): Promise<GetRecommendationsResponseDto>;
    trackEvent(trackEventDto: TrackEventDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    manualProcessRecommendations(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
