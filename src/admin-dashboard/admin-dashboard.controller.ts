import { Controller, Get, Post, UseGuards, Req, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { YoutubeService } from '../youtube/youtube.service';

@Controller('admin/dashboard')
@UseGuards(AdminAuthGuard)
export class AdminDashboardController {
  
  constructor(private readonly youtubeService: YoutubeService) {}

  // Simple test endpoint
  @Get('test')
  async testEndpoint(@Req() req) {
    return {
      message: 'Admin dashboard is working!',
      user: req.user,
      timestamp: new Date().toISOString()
    };
  }

  @Get()
  async getDashboard(@Req() req) {
    return {
      message: 'Welcome to Admin Dashboard',
      user: req.user,
      features: [
        'YouTube Integration Management',
        'User Management',
        'Content Moderation',
        'Analytics',
        'System Settings'
      ]
    };
  }

  @Get('youtube-status')
  async getYouTubeStatus(@Req() req) {
    // Check if YouTube tokens are available
    const hasTokens = this.youtubeService.tokens ? true : false;
    
    return {
      message: 'YouTube Integration Status',
      user: req.user,
      youtubeConnected: hasTokens,
      channelInfo: hasTokens ? {
        name: 'Your YouTube Channel',
        subscribers: 1000,
        videos: 50
      } : null,
      statusMessage: hasTokens ? 'YouTube API connected' : 'YouTube API not connected. Use /auth/google to connect.'
    };
  }

  @Get('users/stats')
  async getUserStats(@Req() req) {
    return {
      message: 'User Statistics',
      user: req.user,
      stats: {
        totalStudents: 150,
        totalTeachers: 25,
        activeUsers: 120,
        newUsersThisMonth: 15
      }
    };
  }

  @Post('system/restart')
  async restartSystem(@Req() req) {
    return {
      message: 'System restart initiated',
      user: req.user,
      timestamp: new Date().toISOString()
    };
  }

  // Admin YouTube Video Upload (requires admin token)
  @Post('youtube/upload-video')
  @UseInterceptors(FileInterceptor('videoFile'))
  async uploadVideoToYouTube(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; description: string }
  ) {
    try {
      // Check if YouTube is connected
      if (!this.youtubeService.tokens) {
        return {
          success: false,
          message: 'YouTube API not connected. Please connect YouTube first using /auth/google',
          user: req.user
        };
      }

      // Upload video using existing YouTube service
      const result = await this.youtubeService.uploadVideo(body.title, body.description, file.path);
      
      return {
        success: true,
        message: 'Video uploaded to YouTube successfully',
        user: req.user,
        videoId: result.id,
        videoTitle: result.snippet?.title,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to upload video to YouTube',
        error: error.message,
        user: req.user
      };
    }
  }

  // Get YouTube connection status
  @Get('youtube/connect-status')
  async getYouTubeConnectionStatus(@Req() req) {
    const hasTokens = this.youtubeService.tokens ? true : false;
    
    return {
      message: 'YouTube Connection Status',
      user: req.user,
      connected: hasTokens,
              connectionUrl: hasTokens ? null : process.env.FRONTEND_BASE_URL + '/auth/google',
      statusMessage: hasTokens ? 'YouTube API is connected and ready for uploads' : 'Click the connection URL to connect YouTube API'
    };
  }

  // Refresh YouTube tokens (admin only)
  @Post('youtube/refresh-tokens')
  async refreshYouTubeTokens(@Req() req) {
    try {
      await this.youtubeService.refreshAccessToken();
      return {
        success: true,
        message: 'YouTube tokens refreshed successfully',
        user: req.user,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to refresh YouTube tokens',
        error: error.message,
        user: req.user
      };
    }
  }
} 