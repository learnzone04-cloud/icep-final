import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInteraction } from '../entities/UserInteraction';
import { TrackEventDto } from '../dtos/track-event.dto';

@Injectable()
export class EventTrackingService {
  constructor(
    @InjectRepository(UserInteraction)
    private userInteractionRepository: Repository<UserInteraction>,
  ) {}

  async trackEvent(trackEventDto: TrackEventDto & { userId: number }): Promise<void> {
    // Calculate watch percentage if watch time and total time are provided
    let watchPercentage = trackEventDto.watchPercentage;
    if (trackEventDto.watchTime && trackEventDto.totalTime) {
      watchPercentage = (trackEventDto.watchTime / trackEventDto.totalTime) * 100;
    }

    // Create new interaction record
    const interaction = this.userInteractionRepository.create({
      userId: trackEventDto.userId,
      contentId: trackEventDto.contentId,
      contentType: trackEventDto.contentType,
      watchTime: trackEventDto.watchTime,
      totalTime: trackEventDto.totalTime,
      watchPercentage,
      scrollPercentage: trackEventDto.scrollPercentage,
      liked: trackEventDto.liked || false,
      commented: trackEventDto.commented || false,
      followed: trackEventDto.followed || false,
      shared: trackEventDto.shared || false,
      saved: trackEventDto.saved || false,
      timestamp: new Date(),
    });

    await this.userInteractionRepository.save(interaction);
  }

  async getUserInteractions(userId: number, days: number = 14): Promise<UserInteraction[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.userInteractionRepository.find({
      where: {
        userId,
        timestamp: { $gte: cutoffDate } as any,
      },
      order: { timestamp: 'DESC' },
    });
  }

  async getInteractionsByContentType(userId: number, contentType: string, days: number = 14): Promise<UserInteraction[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.userInteractionRepository.find({
      where: {
        userId,
        contentType: contentType as any,
        timestamp: { $gte: cutoffDate } as any,
      },
      order: { timestamp: 'DESC' },
    });
  }
}

