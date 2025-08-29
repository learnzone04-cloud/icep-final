import { Controller, Post, Body, Param, Req, UseGuards, Get, Delete, Patch } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotesService } from './notes.service';
import { StudentService } from 'src/student/student.service';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly studentService: StudentService,
  ) {}

  @Post()
  async createNote(@Req() req: any, @Body('title') title?: string) {
    const userId = req.user.id;
    const student = await this.studentService.findOneByUserId(userId);
    if (!student) {
      throw new Error(`Student not found for userId: ${userId}`);
    }
    return this.notesService.createNote(student.id, title || 'initial note');
  }

  @Post(':noteId/context')
  async createNoteContext(
    @Param('noteId') noteId: number,
    @Body('context') context: string,
    @Body('videoId') videoId?: number,
  ) {
    return this.notesService.createNoteContext(noteId, context, videoId);
  }

  @Get()
  async getNotes(@Req() req: any) {
    const userId = req.user.id;
    const student = await this.studentService.findOneByUserId(userId);
    if (!student) {
      throw new Error(`Student not found for userId: ${userId}`);
    }
    return this.notesService.getNotesForStudent(student.id);
  }

  @Delete(':noteId')
  async deleteNote(@Param('noteId') noteId: number) {
    return this.notesService.deleteNote(noteId);
  }

  @Patch(':noteId')
  async editNote(@Param('noteId') noteId: number, @Body('title') title: string) {
    return this.notesService.editNote(noteId, title);
  }

  @Patch('context/:contextId')
  async editNoteContext(@Param('contextId') contextId: number, @Body('context') context: string) {
    return this.notesService.editNoteContext(contextId, context);
  }
}
