import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationRoom } from './entity/ConversationRoom';
import { ConversationRoomParticipant } from './entity/ConversationRoomParticipant';
import { LiveKitService } from './livekit.service';
import { LiveKitController } from './livekit.controller';
import { ConversationRoomService } from './conversation-room.service';
import { ConversationRoomController } from './conversation-room.controller';
import { ConversationRoomParticipantService } from './conversation-room-participant.service';
import { PlacementTest } from '../placement-test/placement-test.entity';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { Student } from '../student/entity/Student';
import { StudentType } from '../student-type/entity/StudentType';
import { TypeEntity } from '../types/entity/Type';
import { UserEntity } from '../users/entity/User';
import { NotificationModule } from '../notification/notification.module';
import { DiscountsModule } from 'src/discounts/discounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConversationRoom,
      ConversationRoomParticipant,
      PlacementTest,
      TeacherEntity,
      Student,
      StudentType,
      TypeEntity,
      UserEntity,
    ]),
    NotificationModule,
    DiscountsModule,
  ],
  providers: [LiveKitService, ConversationRoomService, ConversationRoomParticipantService],
  controllers: [LiveKitController, ConversationRoomController],
  exports: [],
})
export class ConversationRoomModule {} 