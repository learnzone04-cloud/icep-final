import { Module } from '@nestjs/common';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';
import { YoutubeModule } from '../youtube/youtube.module';

@Module({
  imports: [AdminAuthModule, YoutubeModule],
  controllers: [AdminDashboardController],
})
export class AdminDashboardModule {} 