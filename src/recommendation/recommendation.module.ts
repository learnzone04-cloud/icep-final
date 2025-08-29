import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UserInteraction } from './entities/UserInteraction';
import { UserProfile } from './entities/UserProfile';
import { UserRecommendation } from './entities/UserRecommendation';
import { UserTagPreference } from './entities/UserTagPreference';
import { RecommendationService } from './services/recommendation.service';
import { EventTrackingService } from './services/event-tracking.service';
import { BackgroundJobService } from './services/background-job.service';
import { RecommendationController } from './controllers/recommendation.controller';
import { RecommendationGateway } from './gateways/recommendation.gateway';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserInteraction,
      UserProfile,
      UserRecommendation,
      UserTagPreference,
    ]),
    ScheduleModule.forRoot(), // For background jobs
    TagsModule, // Import tags functionality
  ],
  controllers: [RecommendationController],
  providers: [
    RecommendationService,
    EventTrackingService,
    BackgroundJobService,
    RecommendationGateway,
  ],
  exports: [
    RecommendationService,
    EventTrackingService,
    BackgroundJobService,
    RecommendationGateway,
  ],
})
export class RecommendationModule {}

