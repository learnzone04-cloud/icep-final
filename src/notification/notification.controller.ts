import { Controller, Get, Post, Delete, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { Request } from 'express';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(
    @Req() req: Request,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const userId = (req.user as any).id;
    const limitNum = limit ? parseInt(limit) : 20;
    const offsetNum = offset ? parseInt(offset) : 0;
    
    return this.notificationService.getUserNotifications(userId, limitNum, offsetNum);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: Request) {
    const userId = (req.user as any).id;
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    await this.notificationService.markAsRead(parseInt(id), userId);
    return { success: true };
  }

  @Post('mark-all-read')
  async markAllAsRead(@Req() req: Request) {
    const userId = (req.user as any).id;
    await this.notificationService.markAllAsRead(userId);
    return { success: true };
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    await this.notificationService.deleteNotification(parseInt(id), userId);
    return { success: true };
  }
} 