import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountsService } from 'src/discounts/discounts.service';
import { DiscountsController } from 'src/discounts/discounts.controller';
import { Discount } from 'src/discounts/entities/discount.entity';
import { Coupon } from 'src/discounts/entities/coupon.entity';
import { Course } from 'src/course/entities/course.entity';
import { ConversationRoom } from 'src/conversation-room/entity/ConversationRoom';
import { Student } from 'src/student/entity/Student';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Discount,
      Coupon,
      Course,
      ConversationRoom,
      Student,
    ]),
  ],
  controllers: [DiscountsController],
  providers: [DiscountsService],
  exports: [DiscountsService],
})
export class DiscountsModule {}


