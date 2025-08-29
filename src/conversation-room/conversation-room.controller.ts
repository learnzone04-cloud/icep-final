import { Controller, Post, Body, UseGuards, Req, Get, Param, NotFoundException } from '@nestjs/common';
import { ConversationRoomService } from './conversation-room.service';
import { ConversationRoom } from './entity/ConversationRoom';
import { ConversationRoomParticipantService } from './conversation-room-participant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { Student } from '../student/entity/Student';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('conversation-room')
export class ConversationRoomController {
  constructor(
    private readonly roomService: ConversationRoomService,
    private readonly participantService: ConversationRoomParticipantService,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createRoom(@Body() body: Partial<ConversationRoom>, @Req() req: Request): Promise<ConversationRoom> {
    const userId = (req.user as any).id;
    const teacher = await this.teacherRepo.findOne({ 
      where: { userId },
      select: ['id', 'typeId', 'userId']
    });
    if (!teacher) throw new NotFoundException('Teacher not found');
    return this.roomService.createRoom({ ...body, teacher });
  }

  @UseGuards(JwtAuthGuard)
  @Post('enroll')
  async enrollStudent(@Req() req: Request, @Body() body: { roomId: number, paymentMethodId: string, couponCode?: string }) {
    const userId = (req.user as any).id;
    const student = await this.studentRepo.findOne({ where: { userId } });
    if (!student) throw new NotFoundException('Student not found');
    return this.participantService.enrollStudent(body.roomId, student.id, body.paymentMethodId, body.couponCode);
  }

  // 1. Get conversation rooms by student type (should be same to the rooms type)
  @UseGuards(JwtAuthGuard)
  @Get('by-student-type')
  async getRoomsByStudentType(@Req() req: Request) {
    const userId = (req.user as any).id;
    const student = await this.studentRepo.findOne({ 
      where: { userId },
      relations: ['studentTypes', 'studentTypes.type']
    });
    if (!student) throw new NotFoundException('Student not found');
    return this.roomService.getRoomsByStudentType(student);
  }

  // 2. Get the rooms that the teacher have it and it not canceled or completed
  @UseGuards(JwtAuthGuard)
  @Get('teacher-active-rooms')
  async getTeacherActiveRooms(@Req() req: Request) {
    const userId = (req.user as any).id;
    const teacher = await this.teacherRepo.findOne({ where: { userId } });
    if (!teacher) throw new Error('Teacher not found');
    return this.roomService.getTeacherActiveRooms(teacher.id);
  }

  // 3. Get the students that enroll on this room by the teacher
  @UseGuards(JwtAuthGuard)
  @Get('room/:roomId/students')
  async getRoomStudents(@Param('roomId') roomId: number, @Req() req: Request) {
    const userId = (req.user as any).id;
    const teacher = await this.teacherRepo.findOne({ where: { userId } });
    if (!teacher) throw new Error('Teacher not found');
    return this.roomService.getRoomStudents(roomId, teacher.id);
  }

  // 4. Get the rooms that the student enrolls on
  @UseGuards(JwtAuthGuard)
  @Get('student-enrolled-rooms')
  async getStudentEnrolledRooms(@Req() req: Request) {
    const userId = (req.user as any).id;
    const student = await this.studentRepo.findOne({ where: { userId } });
    if (!student) throw new NotFoundException('Student not found');
    return this.roomService.getStudentEnrolledRooms(student.id);
  }
} 