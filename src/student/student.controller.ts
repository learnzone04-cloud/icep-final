import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateStudentDto } from './dtos/create-student.dto';
import { StudentService } from './student.service';
import { JwtService } from '@nestjs/jwt';
import { TypesService } from 'src/types/types.service';
import { NotesService } from 'src/notes/notes.service';

@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly jwtService: JwtService,
    private readonly typesService: TypesService,
    private readonly notesService: NotesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/profile')
  async completeProfile(
    @Request() req,
    @Body() body: { work: string, typeId: number },
  ): Promise<any> {
    const userId = req.user.id;
    const { work, typeId } = body;
    // 1. Update work in student table
    await this.studentService.updateProfile(userId, { work });
    // 2. Add type to student-type if not present
    await this.studentService.addTypeIfNotExists(userId, typeId);
    // 3. Get type info
    const type = await this.typesService.findOneById(typeId);
    // 4. Get studentId
    const student = await this.studentService.findOneByUserId(userId);
    if (!student) {
      throw new Error(`Student not found for userId: ${userId}`);
    }
    // 5. Issue new token with type info and studentId
    const payload = {
      id: userId,
      role: req.user.role,
      typeId: type.id,
      typeName: type.name,
      name: req.user.name,
      studentId: student.id,
    };
    const token = this.jwtService.sign(payload);
    // 6. Create a note for the student
    console.log('Creating note for student:', student.id);
    await this.notesService.createNote(student.id, 'initial note');
    return { token };
  }

  @Get('my-ids')
  @UseGuards(JwtAuthGuard)
  async getMyIds(@Request() req) {
    const senderId = req.user.id;
    let studentId = null;
    if (req.user.role === 'Student') {
      studentId = await this.studentService.getStudentIdByUserId(senderId);
    }
    return { senderId, studentId };
  }
}