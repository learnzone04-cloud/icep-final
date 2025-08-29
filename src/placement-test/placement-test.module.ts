import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PlacementTest } from './placement-test.entity';
import { PlacementTestService } from './placement-test.service';
import { PlacementTestController } from './placement-test.controller';
import { TypeEntity } from '../types/entity/Type';
import { StudentType } from '../student-type/entity/StudentType';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([PlacementTest, TypeEntity, StudentType]),
    HttpModule,
  ],
  providers: [PlacementTestService],
  controllers: [PlacementTestController],
})
export class PlacementTestModule {}
