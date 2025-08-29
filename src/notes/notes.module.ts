import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entity/Note';
import { NoteContext } from './entity/NoteContext';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note, NoteContext]),
    forwardRef(() => StudentModule),
  ],
  providers: [NotesService],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
