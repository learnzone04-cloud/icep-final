import { Repository } from 'typeorm';
import { UserInteraction } from '../entities/UserInteraction';
import { TrackEventDto } from '../dtos/track-event.dto';
export declare class EventTrackingService {
    private userInteractionRepository;
    constructor(userInteractionRepository: Repository<UserInteraction>);
    trackEvent(trackEventDto: TrackEventDto & {
        userId: number;
    }): Promise<void>;
    getUserInteractions(userId: number, days?: number): Promise<UserInteraction[]>;
    getInteractionsByContentType(userId: number, contentType: string, days?: number): Promise<UserInteraction[]>;
}
