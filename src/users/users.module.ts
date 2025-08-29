import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/User';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { CertificateEntity } from '../certificate/entities/certificate.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';
import { GmailModule } from '../gmail/gmail.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TeacherEntity, CertificateEntity]), forwardRef(() => AuthModule), AdminAuthModule, GmailModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
