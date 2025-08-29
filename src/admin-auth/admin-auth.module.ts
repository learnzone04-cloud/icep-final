import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AdminJwtStrategy } from './admin-jwt.strategy';
import { AdminGoogleStrategy } from './admin-google.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ADMIN_JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AdminAuthService,
    AdminJwtStrategy,
    AdminGoogleStrategy,
  ],
  controllers: [AdminAuthController],
  exports: [AdminAuthService, JwtModule],
})
export class AdminAuthModule {} 