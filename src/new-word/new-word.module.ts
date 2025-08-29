import { Module } from '@nestjs/common';
import { NewWordService } from './new-word.service';
import { NewWordController } from './new-word.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewWord } from './entity/NewWord';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [TypeOrmModule.forFeature([NewWord]), StudentModule],
  providers: [NewWordService],
  controllers: [NewWordController],
})
export class NewWordModule {}
