import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { HubService } from './hub.service';
import { HubGateway } from './hub.gateway';
import { HubMessage } from './entities/hub-message.entity';
import { TypeEntity } from '../types/entity/Type';
import { WsJwtAuthGuard } from './ws-jwt-auth.guard';
import { UserEntity } from '../users/entity/User';
import { ProfanityFilterService } from './profanity-filter.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([HubMessage, TypeEntity, UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '50000000s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [HubService, HubGateway, WsJwtAuthGuard, ProfanityFilterService],
  exports: [HubService],
})
export class HubModule {}
