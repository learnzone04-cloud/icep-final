import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeEntity } from './entity/Type';

@Module({
  imports: [TypeOrmModule.forFeature([TypeEntity])],
  providers: [TypesService],
  controllers: [TypesController],
  exports: [TypesService],
})
export class TypesModule {}
