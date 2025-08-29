import { Module, forwardRef } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherEntity } from './entity/Teacher';
import { UsersModule } from '../users/users.module';
import { TypesModule } from '../types/types.module';
import { CertificateEntity } from '../certificate/entities/certificate.entity';
import { ArticleEntity } from '../article/entity/Article';
import { ReelEntity } from '../reels/entity/Reel';
import { Course } from '../course/entities/course.entity';
import { Follower } from '../follower/entities/follower.entity';
import { StudentModule } from '../student/student.module';
import { RateModule } from 'src/rate/rate.module';
import { Coupon } from '../discounts/entities/coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CertificateEntity,
      TeacherEntity,
      ArticleEntity,
      ReelEntity,
      Course,
      Follower,
      Coupon,
    ]),
    forwardRef(() => UsersModule),
    TypesModule,
    StudentModule,
    RateModule,
  ],
  providers: [TeacherService],
  controllers: [TeacherController],
  exports: [TeacherService],
})
export class TeacherModule {}
