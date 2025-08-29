import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentType } from './entity/StudentType';
import { StudentService } from 'src/student/student.service';

@Controller('student-type')
export class StudentTypeController {
  constructor(
    @InjectRepository(StudentType)
    private readonly studentTypeRepo: Repository<StudentType>,
    private readonly studentService: StudentService,
  ) {}

  @Get('my-types')
  @UseGuards(JwtAuthGuard)
  async getMyStudentTypes(@Request() req) {
    const userId = req.user.id;
    const studentId = await this.studentService.getStudentIdByUserId(userId);
    return this.studentTypeRepo.find({
      where: { studentId },
      relations: ['type'],
    });
  }
} 