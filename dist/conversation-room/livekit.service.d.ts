import { ConfigService } from '@nestjs/config';
import { ConversationRoom } from './entity/ConversationRoom';
import { TeacherEntity } from '../teacher/entity/Teacher';
import { Student } from '../student/entity/Student';
import { ConversationRoomParticipant } from './entity/ConversationRoomParticipant';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
export declare class LiveKitService {
    private readonly roomRepo;
    private readonly teacherRepo;
    private readonly studentRepo;
    private readonly participantRepo;
    private readonly notificationService;
    private readonly configService;
    private apiKey;
    private apiSecret;
    private wsUrl;
    constructor(roomRepo: Repository<ConversationRoom>, teacherRepo: Repository<TeacherEntity>, studentRepo: Repository<Student>, participantRepo: Repository<ConversationRoomParticipant>, notificationService: NotificationService, configService: ConfigService);
    buildTokenWithAccessCheck(roomName: string, user: any): Promise<{
        token: string;
        wsUrl: string;
        identity: string;
    }>;
    generateToken(roomName: string, identity: string, ttl?: number): Promise<string>;
    markRoomAsCompleted(roomId: number): Promise<void>;
    cancelRoom(roomId: number): Promise<void>;
}
