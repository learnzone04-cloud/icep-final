import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AdminAuthService } from './admin-auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGoogleStrategy extends PassportStrategy(Strategy, 'admin-google') {
  constructor(private adminAuthService: AdminAuthService, private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_ADMIN_CALLBACK_URL'),
      scope: [
        'email', 
        'profile', 
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/calendar'
      ],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Get both admin user and YouTube tokens
    const adminUser = await this.adminAuthService.validateAdminUser(profile);
    const youtubeTokens = { accessToken, refreshToken };
    
    return {
      ...adminUser,
      youtubeTokens
    };
  }
} 