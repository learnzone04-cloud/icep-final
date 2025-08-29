import { Controller, Get, Post, Delete, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { Request } from 'express';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('test')
  async testNotification(@Req() req: Request) {
    const userId = this.getUserIdFromToken(req);
    console.log('🧪 Test notification endpoint called for userId:', userId);
    
    try {
      const notification = await this.notificationService.testNotification(userId);
      return { 
        success: true, 
        message: 'Test notification created successfully',
        notificationId: notification.id 
      };
    } catch (error) {
      console.error('❌ Test notification failed:', error);
      return { 
        success: false, 
        message: 'Test notification failed',
        error: error.message 
      };
    }
  }

  private getUserIdFromToken(req: Request): number {
    const user = req.user as any;
    // For students, use studentId to get userId
    if (user.role === 'Student' && user.studentId) {
      // We need to get userId from studentId
      // This will be handled by the service layer
      return user.id; // Fallback to user.id for now
    }
    // For teachers, use teacherId to get userId
    if (user.role === 'Teacher' && user.teacherId) {
      // We need to get userId from teacherId
      // This will be handled by the service layer
      return user.id; // Fallback to user.id for now
    }
    // Fallback to user.id
    return user.id;
  }

  @Get()
  async getUserNotifications(
    @Req() req: Request,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const userId = this.getUserIdFromToken(req);
    const limitNum = limit ? parseInt(limit) : 20;
    const offsetNum = offset ? parseInt(offset) : 0;
    
    return this.notificationService.getUserNotifications(userId, limitNum, offsetNum);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: Request) {
    const userId = this.getUserIdFromToken(req);
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @Post('mark-all-read')
  async markAllAsRead(@Req() req: Request) {
    const userId = this.getUserIdFromToken(req);
    await this.notificationService.markAllAsRead(userId);
    return { success: true };
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: Request) {
    const userId = this.getUserIdFromToken(req);
    await this.notificationService.markAsRead(parseInt(id), userId);
    return { success: true };
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Req() req: Request) {
    const userId = this.getUserIdFromToken(req);
    await this.notificationService.deleteNotification(parseInt(id), userId);
    return { success: true };
  }
} 