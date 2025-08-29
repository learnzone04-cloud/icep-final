import { Repository } from 'typeorm';
import { ConversationRoom } from './entity/ConversationRoom';
import { ConversationRoomParticipant } from './entity/ConversationRoomParticipant';
import { Student } from '../student/entity/Student';
import { NotificationService } from '../notification/notification.service';
export declare class ConversationRoomService {
    private readonly roomRepo;
    private readonly participantRepo;
    private readonly notificationService;
    constructor(roomRepo: Repository<ConversationRoom>, participantRepo: Repository<ConversationRoomParticipant>, notificationService: NotificationService);
    createRoom(data: Partial<ConversationRoom>): Promise<ConversationRoom>;
    getRoomsByStudentType(student: Student): Promise<ConversationRoom[]>;
    getTeacherActiveRooms(teacherId: number): Promise<ConversationRoom[]>;
    getRoomStudents(roomId: number, teacherId: number): Promise<any[]>;
    getStudentEnrolledRooms(studentId: number): Promise<ConversationRoom[]>;
}
