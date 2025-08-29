import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from 'livekit-server-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationRoom, ConversationRoomStatus } from './entity/ConversationRoom';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { Student } from '../student/entity/Student';
import { ConversationRoomParticipant } from './entity/ConversationRoomParticipant';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class LiveKitService {
  private apiKey: string;
  private apiSecret: string;
  private wsUrl: string;

  constructor(
    @InjectRepository(ConversationRoom)
    private readonly roomRepo: Repository<ConversationRoom>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(ConversationRoomParticipant)
    private readonly participantRepo: Repository<ConversationRoomParticipant>,
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('LIVEKIT_API_KEY');
    this.apiSecret = this.configService.get<string>('LIVEKIT_API_SECRET');
    this.wsUrl = this.configService.get<string>('LIVEKIT_WS_URL') || 'wss://icep-oha22jm9.livekit.cloud';
  }

  async buildTokenWithAccessCheck(roomName: string, user: any): Promise<{ token: string; wsUrl: string; identity: string }> {
    const userId = user.id; // from JWT
    const userRole = (user.role || '').toLowerCase();
    const userName = (user.name || '').trim().replace(/\s+/g, ' '); // Clean up spaces
    let identity = '';
    let allowed = false;

    console.log('Building token with access check:', {
      roomName,
      userId,
      userRole,
      userName,
      originalRole: user.role
    });

    // Extract roomId from roomName
    const roomId = parseInt(roomName.replace('conversation-room-', ''));
    const room = await this.roomRepo.findOne({ where: { id: roomId }, relations: ['teacher'] });
    if (!room) throw new BadRequestException('Room not found');

    console.log('Found room:', {
      roomId: room.id,
      teacherId: room.teacher?.id,
      teacherUserId: room.teacher?.userId
    });

    // Check if teacher
    const teacher = await this.teacherRepo.findOne({ where: { userId } });
    console.log('Found teacher:', teacher ? { id: teacher.id, userId: teacher.userId } : null);
    
    if (userRole === 'teacher' && teacher && teacher.id === room.teacher.id) {
      // Only allow teacher to join first (if no participants yet)
      if (!room.teacherJoinedAt) {
        room.teacherJoinedAt = new Date();
        room.status = ConversationRoomStatus.ONGOING;
        await this.roomRepo.save(room);
        
        // Send notification to enrolled students that room has started
        try {
          const enrolledStudents = await this.participantRepo.find({
            where: { room: { id: roomId } },
            relations: ['student', 'student.user']
          });
          
          if (enrolledStudents.length > 0) {
            const studentIds = enrolledStudents.map(p => p.student.id);
            await this.notificationService.sendRoomStartingNotification(
              roomId,
              room.title,
              room.startTime,
              studentIds,
              room.teacher.id
            );
          }
        } catch (error) {
          console.error('Failed to send room starting notifications:', error);
        }
      }
      allowed = true;
      identity = `id:${teacher.id}|name:${userName}|role:teacher`;
    } else if (userRole === 'student') {
      // Only allow students to join after teacher has joined
      if (!room.teacherJoinedAt) {
        throw new BadRequestException('Teacher must join the room first');
      }
      // Check if student is enrolled
      const student = await this.studentRepo.findOne({ where: { userId } });
      if (!student) throw new BadRequestException('Student not found');
      const participant = await this.participantRepo.findOne({ where: { room: { id: roomId }, student: { id: student.id } } });
      if (!participant) throw new BadRequestException('Not enrolled in this room');
      if (!participant.joinedAt) {
        participant.joinedAt = new Date();
        await this.participantRepo.save(participant);
        
        // Send notification to teacher that student joined
        try {
          const studentUser = await this.studentRepo.findOne({
            where: { id: student.id },
            relations: ['user']
          });
          
          if (studentUser && studentUser.user) {
            const studentName = `${studentUser.user.fName} ${studentUser.user.lName}`;
            await this.notificationService.sendRoomEnrollmentNotification(
              roomId,
              room.title,
              studentName,
              room.teacher.userId
            );
          }
        } catch (error) {
          console.error('Failed to send student joined notification:', error);
        }
      }
      identity = `id:${student.id}|name:${userName}|role:student`;
      allowed = true;
    }

    console.log('Access check result:', { allowed, identity, userRole, teacherFound: !!teacher });

    if (!allowed) throw new BadRequestException('Not allowed to join this room');
    
    // Calculate TTL - use a reasonable default if room times are not set
    let ttl = 3600; // Default 1 hour
    
    if (room.startTime && room.endTime) {
      const roomDurationMs = room.endTime.getTime() - room.startTime.getTime();
      const roomDurationSeconds = Math.floor(roomDurationMs / 1000);
      const extraSeconds = 300; // 5 minutes extra
      ttl = Math.max(roomDurationSeconds + extraSeconds, 3600); // Minimum 1 hour
    }
    
    console.log(`Generating token for room: ${roomName}, identity: ${identity}, TTL: ${ttl}`);
    
    const token = await this.generateToken(roomName, identity, ttl);
    return { token, wsUrl: this.wsUrl, identity };
  }

  async generateToken(roomName: string, identity: string, ttl: number = 3600): Promise<string> {
    try {
      console.log(`Generating LiveKit token with params:`, {
        roomName,
        identity,
        ttl,
        apiKey: this.apiKey.substring(0, 8) + '...' // Log partial key for debugging
      });
      
      const at = new AccessToken(this.apiKey, this.apiSecret, {
        identity,
        ttl,
      });
      
      // Add room grant with full permissions
      at.addGrant({
        room: roomName,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });
      
      const token = await at.toJwt();
      console.log(`Token generated successfully for identity: ${identity}`);
      return token;
    } catch (error) {
      console.error('Error generating LiveKit token:', error);
      throw new BadRequestException('Failed to generate access token');
    }
  }

  async markRoomAsCompleted(roomId: number): Promise<void> {
    const room = await this.roomRepo.findOne({ where: { id: roomId } });
    if (!room) throw new BadRequestException('Room not found');

    room.status = ConversationRoomStatus.COMPLETED;
    await this.roomRepo.save(room);

    // Send completion notification to all participants
    try {
      const participants = await this.participantRepo.find({
        where: { room: { id: roomId } },
        relations: ['student', 'student.user']
      });

      const userIds = [
        room.teacher.userId,
        ...participants.map(p => p.student.userId)
      ];

      for (const userId of userIds) {
        await this.notificationService.createNotification(
          userId,
          'room_completed' as any,
          'Room Completed',
          `The conversation room "${room.title}" has been completed.`,
          { roomId, roomTitle: room.title }
        );
      }
    } catch (error) {
      console.error('Failed to send room completion notifications:', error);
    }
  }

  async cancelRoom(roomId: number): Promise<void> {
    const room = await this.roomRepo.findOne({ where: { id: roomId } });
    if (!room) throw new BadRequestException('Room not found');

    room.status = ConversationRoomStatus.CANCELLED;
    await this.roomRepo.save(room);

    // Note: Room cancellation notifications have been removed as requested
    // The room is still cancelled, but no notification is sent
    console.log(`Room ${roomId} has been cancelled without sending notifications`);
  }
} 