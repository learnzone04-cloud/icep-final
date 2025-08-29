import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminAuthService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  // List of allowed admin email addresses
  private readonly ALLOWED_ADMIN_EMAILS = ['learnzone04@gmail.com'];
  
  // Store YouTube tokens in memory (keyed by admin email)
  private youtubeTokensStore: Map<string, any> = new Map();

  async validateAdminUser(profile: any) {
    const email = profile.emails[0]?.value;
    
    if (!email) {
      throw new UnauthorizedException('Email not found in Google profile');
    }

    // Check if the email is in the allowed admin list
    if (!this.ALLOWED_ADMIN_EMAILS.includes(email)) {
      throw new UnauthorizedException('This email is not authorized for admin access');
    }

    return {
      id: profile.id,
      email: email,
      name: profile.displayName,
      picture: profile.photos[0]?.value,
      role: 'Admin',
    };
  }

  async generateAdminToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: 'Admin',
      picture: user.picture,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: 'Admin',
      },
    };
  }

  async generateAdminTokenWithYouTube(user: any, youtubeTokens: any) {
    const adminToken = await this.generateAdminToken(user);
    
    // Store YouTube tokens for this admin
    this.youtubeTokensStore.set(user.email, youtubeTokens);
    
    return {
      ...adminToken,
      youtubeTokens: {
        accessToken: youtubeTokens.accessToken,
        refreshToken: youtubeTokens.refreshToken,
        scope: 'https://www.googleapis.com/auth/youtube.upload,https://www.googleapis.com/auth/gmail.send'
      },
      message: 'Admin authentication successful with YouTube and Gmail access. Use this token for admin APIs, YouTube operations, and email notifications.'
    };
  }

  // Get YouTube tokens for an admin
  getYouTubeTokens(adminEmail: string) {
    return this.youtubeTokensStore.get(adminEmail);
  }

  // Check if admin has YouTube access
  hasYouTubeAccess(adminEmail: string) {
    return this.youtubeTokensStore.has(adminEmail);
  }

  async verifyAdminToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      
      // Additional verification - check if email is still in allowed list
      if (!this.ALLOWED_ADMIN_EMAILS.includes(payload.email)) {
        throw new UnauthorizedException('Admin access revoked');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid admin token');
    }
  }
} 