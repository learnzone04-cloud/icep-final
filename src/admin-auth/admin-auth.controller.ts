import { Controller, Get, Req, Res, UseGuards, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthGuard } from './admin-auth.guard';
import { Response } from 'express';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(
    private adminAuthService: AdminAuthService,
    private readonly configService: ConfigService
  ) {}

  // Initiate Google OAuth2 flow
  @Get('google')
  @UseGuards(AuthGuard('admin-google'))
  async googleAuth() {
    // This will redirect to Google OAuth
  }

  // New endpoint for frontend to initiate OAuth with custom redirect
  @Get('google/init')
  async initiateGoogleAuth(@Query('redirect_uri') redirectUri?: string) {
    const frontendUrl = redirectUri || this.configService.get<string>('FRONTEND_BASE_URL');
    
    // Store the redirect URI in session or return it
    return {
      authUrl: `/admin/auth/google?redirect_uri=${encodeURIComponent(frontendUrl)}`,
      message: 'Use this URL to initiate Google OAuth2 flow'
    };
  }

  // Google OAuth2 callback - Modified for frontend integration
  @Get('google/callback')
  @UseGuards(AuthGuard('admin-google'))
  async googleAuthRedirect(
    @Req() req, 
    @Res() res: Response,
    @Query('redirect_uri') redirectUri?: string
  ) {
    try {
      const result = await this.adminAuthService.generateAdminTokenWithYouTube(
        req.user, 
        req.user.youtubeTokens
      );
      
      // Default frontend URL if none provided
      const frontendUrl = redirectUri || this.configService.get<string>('FRONTEND_BASE_URL');
      
      // Create URL with tokens as query parameters for frontend
      const redirectUrl = new URL('/admin/auth-success', frontendUrl);
      redirectUrl.searchParams.set('accessToken', result.accessToken);
      redirectUrl.searchParams.set('user', JSON.stringify(result.user));
      redirectUrl.searchParams.set('youtubeTokens', JSON.stringify(result.youtubeTokens));
      redirectUrl.searchParams.set('success', 'true');
      
      // Redirect to frontend with tokens
      res.redirect(redirectUrl.toString());
      
    } catch (error) {
      // Redirect to frontend with error
      const frontendUrl = redirectUri || this.configService.get<string>('FRONTEND_BASE_URL');
      const errorUrl = new URL('/admin/auth-error', frontendUrl);
      errorUrl.searchParams.set('error', 'authentication_failed');
      errorUrl.searchParams.set('message', error.message);
      
      res.redirect(errorUrl.toString());
    }
  }

  // Alternative: Return JSON response instead of redirect (for API calls)
  @Get('google/callback/json')
  @UseGuards(AuthGuard('admin-google'))
  async googleAuthCallbackJson(@Req() req, @Res() res: Response) {
    try {
      const result = await this.adminAuthService.generateAdminTokenWithYouTube(
        req.user, 
        req.user.youtubeTokens
      );
      
      res.json({
        success: true,
        accessToken: result.accessToken,
        user: result.user,
        youtubeTokens: result.youtubeTokens,
        message: result.message
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Admin authentication failed',
        message: error.message
      });
    }
  }

  // Verify admin token
  @Get('verify')
  @UseGuards(AdminAuthGuard)
  async verifyToken(@Req() req) {
    return {
      message: 'Admin token is valid',
      user: req.user,
    };
  }

  // Get admin profile
  @Get('profile')
  @UseGuards(AdminAuthGuard)
  async getProfile(@Req() req) {
    return {
      message: 'Admin profile',
      user: req.user,
    };
  }
} 