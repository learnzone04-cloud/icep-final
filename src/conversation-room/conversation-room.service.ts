import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Between } from 'typeorm';
import { ConversationRoom } from './entity/ConversationRoom';
import { ConversationRoomParticipant } from './entity/ConversationRoomParticipant';
import { Student } from '../student/entity/Student';
import { PlacementLevel } from '../placement-test/placement-test.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ConversationRoomService {
  constructor(
    @InjectRepository(ConversationRoom)
    private readonly roomRepo: Repository<ConversationRoom>,
    @InjectRepository(ConversationRoomParticipant)
    private readonly participantRepo: Repository<ConversationRoomParticipant>,
    private readonly notificationService: NotificationService,
  ) {}

  async createRoom(data: Partial<ConversationRoom>): Promise<ConversationRoom> {
    // Validate at least one level
    if (!data.level || !Array.isArray(data.level) || data.level.length === 0) {
      throw new BadRequestException('At least one level is required');
    }
    // Validate all levels are valid PlacementLevel
    for (const lvl of data.level) {
      if (!Object.values(PlacementLevel).includes(lvl)) {
        throw new BadRequestException(`Invalid level: ${lvl}`);
      }
    }
    // Validate future date
    const now = new Date();
    if (!data.startTime || new Date(data.startTime) <= now) {
      throw new BadRequestException('Start time must be in the future');
    }
    if (!data.endTime || new Date(data.endTime) <= new Date(data.startTime)) {
      throw new BadRequestException('End time must be after start time');
    }
    
    // Set the room's typeId based on the teacher's type
    if (data.teacher && (data.teacher as any).typeId) {
      data.typeId = (data.teacher as any).typeId;
    } else if (data.teacher && (data.teacher as any).id) {
      // If teacher object doesn't have typeId, fetch it from the database
      const teacher = await this.roomRepo.manager
        .createQueryBuilder()
        .select('teacher.typeId')
        .from('teachers', 'teacher')
        .where('teacher.id = :teacherId', { teacherId: (data.teacher as any).id })
        .getRawOne();
      if (teacher) {
        data.typeId = teacher.typeId;
      } else {
        throw new BadRequestException('Teacher type not found');
      }
    } else {
      throw new BadRequestException('Teacher is required');
    }
    
    // Validate no overlapping rooms for the same teacher
    if (data.teacher && (data.teacher as any).id) {
      const overlap = await this.roomRepo.createQueryBuilder('room')
        .leftJoinAndSelect('room.teacher', 'teacher')
        .where('teacher.id = :teacherId', { teacherId: (data.teacher as any).id })
        .andWhere('room.startTime < :newEnd', { newEnd: data.endTime })
        .andWhere(':newStart < room.endTime', { newStart: data.startTime })
        .getOne();
      if (overlap) {
        throw new BadRequestException('Teacher already has a room during this time');
      }
    }
    
    const room = this.roomRepo.create(data);
    const savedRoom = await this.roomRepo.save(room);
    
    // Send notification to followers of the teacher
    try {
      const teacherName = `${(data.teacher as any).user?.fName || 'Teacher'} ${(data.teacher as any).user?.lName || ''}`;
      
      // Get all students who follow this teacher
      const followers = await this.roomRepo.manager
        .createQueryBuilder()
        .select('f.studentId')
        .from('follower', 'f')
        .where('f.teacherId = :teacherId', { teacherId: (data.teacher as any).id })
        .getRawMany();
      
      if (followers.length > 0) {
        const studentIds = followers.map(f => f.studentId);
        await this.notificationService.sendRoomCreatedNotification(
          savedRoom.id,
          savedRoom.title,
          teacherName,
          studentIds
        );
      }
    } catch (error) {
      // Log error but don't fail the room creation
      console.error('Failed to send room creation notifications:', error);
    }
    
    return savedRoom;
  }

  // 1. Get conversation rooms by student type (should be same to the rooms type)
  async getRoomsByStudentType(student: Student): Promise<ConversationRoom[]> {
    if (!student.studentTypes || student.studentTypes.length === 0) {
      return [];
    }

    const studentTypeIds = student.studentTypes.map(st => st.typeId);
    
    return this.roomRepo.createQueryBuilder('room')
      .leftJoinAndSelect('room.teacher', 'teacher')
      .leftJoinAndSelect('room.type', 'type')
      .where('room.typeId IN (:...typeIds)', { typeIds: studentTypeIds })
      .andWhere('room.status IN (:...statuses)', { 
        statuses: ['scheduled', 'ongoing'] 
      })
      .andWhere('room.startTime > :now', { now: new Date() })
      .orderBy('room.startTime', 'ASC')
      .getMany();
  }

  // 2. Get the rooms that the teacher have it and it not canceled or completed
  async getTeacherActiveRooms(teacherId: number): Promise<ConversationRoom[]> {
    return this.roomRepo.createQueryBuilder('room')
      .leftJoinAndSelect('room.type', 'type')
      .leftJoinAndSelect('room.participants', 'participants')
      .leftJoinAndSelect('participants.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('room.teacher', 'teacher')
      .where('teacher.id = :teacherId', { teacherId })
      .andWhere('room.status IN (:...statuses)', { 
        statuses: ['scheduled', 'ongoing'] 
      })
      .orderBy('room.startTime', 'ASC')
      .getMany();
  }

  // 3. Get the students that enroll on this room by the teacher
  async getRoomStudents(roomId: number, teacherId: number): Promise<any[]> {
    // First verify the room belongs to the teacher
    const room = await this.roomRepo.findOne({
      where: { id: roomId },
      relations: ['participants', 'participants.student', 'participants.student.user', 'teacher']
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.teacher.id !== teacherId) {
      throw new ForbiddenException('You do not have access to this room');
    }

    return room.participants.map(participant => ({
      id: participant.student.id,
      userId: participant.student.userId,
      firstName: participant.student.user.fName,
      lastName: participant.student.user.lName,
      email: participant.student.user.email,
      phoneNumber: participant.student.user.phoneNumber,
      paid: participant.paid,
      joinedAt: participant.joinedAt,
      work: participant.student.work
    }));
  }

  // 4. Get the rooms that the student enrolls on
  async getStudentEnrolledRooms(studentId: number): Promise<ConversationRoom[]> {
    return this.roomRepo.createQueryBuilder('room')
      .leftJoinAndSelect('room.teacher', 'teacher')
      .leftJoinAndSelect('room.type', 'type')
      .leftJoinAndSelect('room.participants', 'participants')
      .where('participants.studentId = :studentId', { studentId })
      .orderBy('room.startTime', 'ASC')
      .getMany();
  }
} 